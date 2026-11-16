import Link from "@/router";
import { PageHeader } from "@/components/ui/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/developer/card";
export default function OfferDetailPage() {
    return (<div className="max-w-2xl mx-auto min-w-0">
      <PageHeader title="Offer" description="Company offers appear here when one is sent to you."/>
      <Card>
        <p className="text-body-sm text-muted">This offer is not available.</p>
        <Button className="mt-4" variant="secondary" asChild>
          <Link href="/developer/career">Back to Career</Link>
        </Button>
      </Card>
    </div>);
}
