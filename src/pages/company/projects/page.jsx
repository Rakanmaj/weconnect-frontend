import Link from "@/router";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/common";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/lib/auth';
import { canUseCompanyPath } from '@/lib/company-access';
import { useResource } from "@/lib/api";
export default function CompanyProjectsPage() {
    const { user } = useAuth();
    const live = useResource('/company/projects');
    return (<>
      <PageHeader title="Projects" description="Manage training, paid, and hiring challenge projects." action={canUseCompanyPath(user, '/company/projects/new') && <Button asChild>
            <Link href="/company/projects/new">
              <Plus className="h-4 w-4"/>
              Create project
            </Link>
          </Button>}/>
      {live.data?.items?.length ? <div className="mb-6 space-y-3">{live.data.items.map(project => <Link key={project.id} href={`/company/projects/${project.id}/matches`} className="block rounded-lg border p-4">
        <p className="font-medium">{project.title}</p>
        <p className="text-caption">{project.delivery_mode} · {project.project_type} · {project.status}</p>
      </Link>)}</div> : <p className="text-body-sm text-muted">No projects yet. Create one to start matching.</p>}
    </>);
}
