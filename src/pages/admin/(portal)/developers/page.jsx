import Link from "@/router";
import { PageHeader } from "@/components/ui/common";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/ui/status-badges";
import { LevelBadge } from "@/components/ui/status-badges";
import { adminDevelopersList } from "@/lib/mock-data";
const columns = [
    {
        key: "name",
        header: "Developer",
        cell: (row) => (<Link href={`/admin/developers/${row.id}`} className="flex items-center gap-2 text-primary hover:underline">
        <Avatar name={row.name} size="sm"/>
        {row.name}
      </Link>),
    },
    { key: "role", header: "Role", cell: (row) => row.role },
    { key: "location", header: "Location", cell: (row) => row.location },
    {
        key: "level",
        header: "Level",
        cell: (row) => <LevelBadge level={row.overallLevel}/>,
    },
    {
        key: "status",
        header: "Status",
        cell: (row) => <StatusBadge status={row.accountVerificationStatus}/>,
    },
    {
        key: "reliability",
        header: "Reliability",
        cell: (row) => `${row.reliability}%`,
    },
];
export default function AdminDevelopersPage() {
    return (<>
      <PageHeader title="Developers" description="Manage all platform developers."/>
      <DataTable data={adminDevelopersList} columns={columns} searchKeys={["name", "role", "location"]} searchPlaceholder="Search developers..."/>
    </>);
}
