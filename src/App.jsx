import { Component, Suspense, lazy, useEffect } from "react";
import { Outlet, useLocation, useParams, useRoutes } from "react-router-dom";
import DeveloperLayout from "./pages/developer/layout";
import CompanyLayout from "./pages/company/layout";
import AdminLayout from "./pages/admin/(portal)/layout";
import ErrorPage from "./pages/error";
import NotFound from "./pages/not-found";
import { RequireAuth } from "./lib/auth";

const DEFAULT_TITLE = "WeConnect — AI-Powered Hiring. Verified Talent. Real Growth.";
const DEFAULT_DESCRIPTION = "WeConnect is an AI-powered developer talent development and hiring platform. Developers prove ability through assessments, challenges and real projects.";

function PageMetadata({ metadata }) {
  useEffect(() => {
    const title = metadata?.title;
    document.title = typeof title === "string" ? `${title} | WeConnect` : title?.absolute || DEFAULT_TITLE;
    document.querySelector('meta[name="description"]').content = metadata?.description || DEFAULT_DESCRIPTION;
  }, [metadata]);
  return null;
}

class PageBoundary extends Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error?.isNotFound) return <MissingPage />;
    if (this.state.error) return <ErrorPage error={this.state.error} reset={() => this.setState({ error: null })} />;
    return this.props.children;
  }
}

function MissingPage() {
  return <><PageMetadata /><NotFound /></>;
}

function RoutePage({ Page }) {
  const params = useParams();
  const { pathname, hash, state } = useLocation();
  useEffect(() => {
    if (state?.preserveScroll) return;
    if (hash) document.getElementById(decodeURIComponent(hash.slice(1)))?.scrollIntoView();
    else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, state]);
  return <PageBoundary key={pathname}><Suspense fallback={null}><Page params={params} /></Suspense></PageBoundary>;
}

// Route groups do not affect URLs; [id] becomes a React Router :id parameter.
const pages = import.meta.glob("./pages/**/page.jsx");
const routeGroups = { public: [], developer: [], company: [], admin: [] };
for (const [file, load] of Object.entries(pages)) {
  const path = "/" + file.replace(/^\.\/pages\//, "").replace(/(?:^|\/)page\.jsx$/, "")
    .split("/").filter(segment => segment && !segment.startsWith("("))
    .map(segment => segment.replace(/^\[(.+)\]$/, ":$1")).join("/");
  const Page = lazy(async () => {
    const module = await load();
    return { default: function LoadedPage(props) {
      const Screen = module.default;
      return <><PageMetadata metadata={module.metadata} /><Screen {...props} /></>;
    } };
  });
  const group = path.startsWith("/developer/") ? "developer" : path.startsWith("/company/") ? "company" : file.includes("/admin/(portal)/") ? "admin" : "public";
  routeGroups[group].push({ path, element: <RoutePage Page={Page} /> });
}

const routes = [
  ...routeGroups.public,
  { element: <RequireAuth role="developer"><DeveloperLayout><Outlet /></DeveloperLayout></RequireAuth>, children: routeGroups.developer },
  { element: <RequireAuth role="company"><CompanyLayout><Outlet /></CompanyLayout></RequireAuth>, children: routeGroups.company },
  { element: <RequireAuth role="admin"><AdminLayout><Outlet /></AdminLayout></RequireAuth>, children: routeGroups.admin },
  { path: "*", element: <MissingPage /> },
];

export default function App() {
  const { pathname } = useLocation();
  return <PageBoundary key={pathname.split("/")[1]}>{useRoutes(routes)}</PageBoundary>;
}
