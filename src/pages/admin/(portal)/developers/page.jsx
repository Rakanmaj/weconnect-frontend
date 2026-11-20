import Link from "@/router";
import { PageHeader } from "@/components/ui/common";
import { DataTable } from "@/components/ui/data-table";
import { Avatar } from "@/components/ui/avatar";
import { StatusBadge, LevelBadge } from "@/components/ui/status-badges";
import { Button } from "@/components/ui/button";
import { LoadingProfile } from "@/components/account/profile-tools";
import { AuthError } from "@/lib/auth";
import { useResource, verificationLabel } from "@/lib/api";

const columns = [
    {
        key: "name",
        header: "Developer",
        cell: (row) => (
            <Link href={`/admin/developer-verification/${row.id}`} className="flex items-center gap-2 text-primary hover:underline">
                <Avatar name={row.name} size="sm"/>
                {row.name || "Unnamed"}
            </Link>
        ),
    },
    { key: "email", header: "Email", cell: (row) => <span className="break-all">{row.email}</span> },
    { key: "role", header: "Role", cell: (row) => row.role },
    { key: "location", header: "Location", cell: (row) => row.location },
    {
        key: "level",
        header: "Placement level",
        cell: (row) => row.overallLevel ? <LevelBadge level={row.overallLevel}/> : <span className="text-muted text-sm">Not assessed</span>,
    },
    {
        key: "status",
        header: "Account status",
        cell: (row) => <StatusBadge status={verificationLabel(row.status)} />,
    },
    {
        key: "challengesPassed",
        header: "Challenges",
        cell: (row) => row.challengesPassed ?? 0,
    },
];

export default function AdminDevelopersPage() {
    const { data, error, reload } = useResource("/admin/developers");
    if (!data) return <LoadingProfile error={error} />;

    return (
        <>
            <PageHeader
                title="Developers"
                description={`${data.total} registered developer${data.total === 1 ? "" : "s"} on the platform.`}
                action={
                    <Button variant="secondary" size="sm" onClick={() => reload().catch(e => {})}>
                        Refresh
                    </Button>
                }
            />
            <AuthError message={error} />
            <DataTable
                data={data.items}
                columns={columns}
                searchKeys={["name", "email", "role", "location"]}
                searchPlaceholder="Search by name or email..."
                emptyMessage="No developers have registered yet."
                pageSize={12}
            />
        </>
    );
}