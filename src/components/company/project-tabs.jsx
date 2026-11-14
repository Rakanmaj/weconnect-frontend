import Link from "@/router";
import { usePathname } from "@/router";
import { cn } from "@/lib/utils";
import { useAuth } from '@/lib/auth';
import { canUseCompanyPath } from '@/lib/company-access';
const tabs = [
    { label: "Overview", href: (id) => `/company/projects/${id}` },
    { label: "Matches", href: (id) => `/company/projects/${id}/matches` },
    { label: "Analysis", href: (id) => `/company/projects/${id}/analysis` },
    { label: "Progress", href: (id) => `/company/projects/${id}/progress` },
    { label: "Submissions", href: (id) => `/company/projects/${id}/submissions` },
    { label: "Compare", href: (id) => `/company/projects/${id}/compare` },
    { label: "Evaluation", href: (id) => `/company/projects/${id}/evaluation` },
    { label: "Decision", href: (id) => `/company/projects/${id}/decision` },
];
export function ProjectTabs({ projectId, projectTitle }) {
    const pathname = usePathname();
    const { user } = useAuth();
    return (<div className="mb-6 min-w-0">
      <p className="text-caption mb-1">Project</p>
      <h1 className="text-h2 text-foreground truncate mb-4">{projectTitle}</h1>
      <nav className="flex gap-1 border-b border-border overflow-x-auto">
        {tabs.filter(tab => canUseCompanyPath(user, tab.href(projectId))).map((tab) => {
            const href = tab.href(projectId);
            const isActive = pathname === href;
            return (<Link key={tab.label} href={href} className={cn("whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors", isActive
                    ? "border-primary text-foreground"
                    : "border-transparent text-muted hover:text-foreground")}>
              {tab.label}
            </Link>);
        })}
      </nav>
    </div>);
}
