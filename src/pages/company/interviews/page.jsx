import Link from "@/router";
import { PageHeader } from "@/components/ui/common";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badges";
import { companyInterviews } from "@/lib/mock-data";
import { Button } from "@/components/ui/button";
const columns = [
    {
        key: "developer",
        header: "Developer",
        cell: (row) => (<div className="flex items-center gap-2">
        <Avatar name={row.developer.name} size="sm"/>
        {row.developer.name}
      </div>),
    },
    { key: "role", header: "Role", cell: (row) => row.role },
    { key: "date", header: "Date", cell: (row) => row.date },
    { key: "time", header: "Time", cell: (row) => row.time },
    { key: "type", header: "Type", cell: (row) => row.type },
    {
        key: "status",
        header: "Status",
        cell: (row) => <StatusBadge status={row.status}/>,
    },
    {
        key: "actions",
        header: "Actions",
        cell: (row) => (<Button size="sm" variant="secondary" asChild>
        <Link href={`/company/talent/${row.developer.id}`}>View Candidate</Link>
      </Button>),
    },
];
export default function CompanyInterviewsPage() {
    return (<>
      <PageHeader title="Interviews" description="Scheduled and requested interviews." action={<Button asChild><Link href="/company/offers">Continue to Offers</Link></Button>}/>
      <DataTable data={companyInterviews} columns={columns} searchKeys={["role", "status", "type"]} searchPlaceholder="Search interviews..."/>
    </>);
}
