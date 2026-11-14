import { AppShell } from "@/components/layout/app-shell";
import { DEVELOPER_NAV } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
export default function DeveloperLayout({ children }) {
    const { user } = useAuth();
    return (<AppShell navItems={DEVELOPER_NAV} user={{ name: user.name, role: user.developer?.preferredPosition || "Developer" }} portal="developer">
      <div className="pb-20 lg:pb-0">{children}</div>
    </AppShell>);
}
