import { AppShell } from "@/components/layout/app-shell";
import { ADMIN_NAV } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
export default function AdminPortalLayout({ children }) {
    const { user } = useAuth();
    return (<div className="admin-portal">
      <AppShell navItems={ADMIN_NAV} user={{ name: user.name, role: "Platform Admin" }} portal="admin">
        {children}
      </AppShell>
    </div>);
}
