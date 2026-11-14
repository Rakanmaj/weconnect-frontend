import { AppShell } from "@/components/layout/app-shell";
import { COMPANY_NAV } from "@/lib/constants";
import { useAuth } from "@/lib/auth";
import { useLocation } from 'react-router-dom';
import Link from '@/router';
import { Button } from '@/components/ui/button';
import { canUseCompanyPath } from '@/lib/company-access';
export default function CompanyLayout({ children }) {
    const { user } = useAuth();
    const { pathname } = useLocation();
    const allowed = canUseCompanyPath(user, pathname);
    return (<AppShell navItems={COMPANY_NAV.filter(item => canUseCompanyPath(user, item.href))} user={{ name: user.name, role: `${user.companyAccess?.role} · ${user.company?.name}` }} portal="company">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm"><span className="font-medium text-navy">{user.company?.name}</span><span className="text-muted">Company role: {user.companyAccess?.role}</span></div>
      {allowed ? children : <div className="mx-auto max-w-xl rounded-xl border border-border bg-card p-8 text-center"><h1 className="text-h2">Access restricted</h1><p className="mt-3 text-sm text-muted">Your {user.companyAccess?.role} role does not include this area of {user.company?.name}.</p><Button asChild className="mt-6"><Link href="/company/dashboard">Back to company dashboard</Link></Button></div>}
    </AppShell>);
}
