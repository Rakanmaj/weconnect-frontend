import Link from "@/router";
import { ArrowRight } from "lucide-react";
import { PageHeader, SectionHeader } from "@/components/ui/common";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/developer/card";
import { StatusBadge } from "@/components/ui/status-badges";
import { Avatar } from "@/components/ui/avatar";
import { hiringPipeline } from "@/lib/mock-data";
const STAGE_ORDER = [
    "Recommended",
    "Interview Requested",
    "Interview Scheduled",
    "Offer",
    "Hired",
    "Rejected",
];
export default function CareerPage() {
    const myPipeline = hiringPipeline;
    const myEntry = myPipeline[0];
    const stageIndex = myEntry ? STAGE_ORDER.indexOf(myEntry.stage) : -1;
    return (<div className="min-w-0 space-y-8">
      <PageHeader title="Career" description="Track hiring pipeline, interview requests, and offers from companies."/>

      {/* Pipeline visualization */}
      {myEntry && (<Card>
          <SectionHeader title="Your Hiring Pipeline" description={`${myEntry.role} at ${myEntry.company}`}/>
          <div className="flex flex-wrap gap-2 mb-4">
            {STAGE_ORDER.slice(0, 5).map((stage, i) => (<div key={stage} className={`flex items-center gap-2 text-xs px-3 py-1.5 rounded-[6px] ${i <= stageIndex ? "bg-teal/10 text-teal font-medium" : "bg-surface text-muted"}`}>
                {stage}
                {i < 4 && <ArrowRight className="h-3 w-3 hidden sm:inline"/>}
              </div>))}
          </div>
          <p className="text-body-sm text-muted">{myEntry.lastActivity}</p>
          <Button className="mt-4" size="sm" asChild>
            <Link href="/developer/interviews/int-1">View Interview</Link>
          </Button>
        </Card>)}

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Interview requests */}
        <section>
          <SectionHeader title="Interview Requests"/>
          <Card>
            <p className="text-body-sm text-muted">No interview requests yet.</p>
          </Card>
        </section>

        {/* Offers */}
        <section>
          <SectionHeader title="Offers"/>
          <Card>
            <p className="text-body-sm text-muted">No offers yet.</p>
          </Card>
        </section>
      </div>

      {/* All pipeline entries for context */}
      <section>
        <SectionHeader title="Platform Activity"/>
        <div className="space-y-3">
          {hiringPipeline.map((h) => (<Card key={h.id} padding={false} className="p-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 min-w-0">
                <div className="flex items-center gap-3 min-w-0">
                  <Avatar name={h.developer.name} size="sm"/>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{h.developer.name}</p>
                    <p className="text-caption truncate">{h.role} · {h.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={h.stage === "Offer" ? "Submitted" : "Active"}/>
                  <span className="text-caption whitespace-nowrap">{h.lastActivity}</span>
                </div>
              </div>
            </Card>))}
        </div>
      </section>
    </div>);
}
