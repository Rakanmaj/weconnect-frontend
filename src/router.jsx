import { forwardRef, useMemo } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

// Keep the existing components' link props while using React Router for navigation.
const Link = forwardRef(function Link({ href, replace, scroll, prefetch: _prefetch, ...props }, ref) {
  if (typeof href === "string" && /^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(href)) {
    return <a ref={ref} href={href} {...props} />;
  }
  return <RouterLink ref={ref} to={href} replace={replace} state={{ preserveScroll: scroll === false }} {...props} />;
});

export default Link;

export function usePathname() {
  return useLocation().pathname;
}

export function useSearchParams() {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search), [search]);
}

export function useRouter() {
  const navigate = useNavigate();
  return useMemo(() => ({
    push: (href, options) => navigate(href, { state: { preserveScroll: options?.scroll === false } }),
    replace: (href, options) => navigate(href, { replace: true, state: { preserveScroll: options?.scroll === false } }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    refresh: () => window.location.reload(),
  }), [navigate]);
}

export function notFound() {
  const error = new Error("Page not found");
  error.isNotFound = true;
  throw error;
}
