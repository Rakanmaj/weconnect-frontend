import Link from '@/router';
import { ArrowRight, ClipboardCheck, FolderKanban, UsersRound, UserSearch, Handshake, Calendar } from 'lucide-react';
import { PageHeader } from '@/components/ui/common';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';

export function CompanyMemberDashboard() {
  const { user } = useAuth();
  const evaluator = user.companyAccess.role === 'Evaluator';
  const items = evaluator ? [
    { title: 'Project submissions', text: 'Open projects and review their progress and submissions.', href: '/company/projects', icon: FolderKanban },
    { title: 'Evaluations', text: 'Access project evaluation and comparison screens.', href: '/company/evaluations', icon: ClipboardCheck },
    { title: 'Company team', text: 'View the team working in your company workspace.', href: '/company/team', icon: UsersRound },
  ] : [
    { title: 'Talent', text: 'Browse developer profiles and talent matches.', href: '/company/talent', icon: UserSearch },
    { title: 'Hiring pipeline', text: 'Open hiring, interviews and offer screens.', href: '/company/hiring', icon: Handshake },
    { title: 'Interviews', text: 'Review company interview arrangements.', href: '/company/interviews', icon: Calendar },
  ];
  return <><PageHeader title={`Welcome, ${user.firstName}`} description={`You are signed in to ${user.company.name} as ${user.companyAccess.role}.`} />
    <div className="grid gap-5 md:grid-cols-3">{items.map(({ title, text, href, icon: Icon }) => <Card key={href}><CardContent className="pt-6"><Icon className="mb-4 h-7 w-7 text-primary" /><h2 className="text-h3">{title}</h2><p className="my-4 text-sm text-muted">{text}</p><Button variant="secondary" asChild><Link href={href}>Open <ArrowRight className="h-4 w-4" /></Link></Button></CardContent></Card>)}</div>
    <p className="mt-6 text-sm text-muted">Project and hiring screens currently use demonstration data. Your company membership and role restrictions are saved and enforced.</p>
  </>;
}
