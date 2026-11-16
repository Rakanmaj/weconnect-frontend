import Link from "@/router";
import { PageHeader } from "@/components/ui/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/developer/card";
export default function InterviewDetailPage() {
    return (<div className="max-w-2xl mx-auto min-w-0">
      <PageHeader title="Interview" description="Interview details appear here when a company schedules one."/>
      <Card>
        <p className="text-body-sm text-muted">This interview is not available.</p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link href="/developer/career">Back to Career</Link>
        </Button>
      </Card>
    </div>);
}
