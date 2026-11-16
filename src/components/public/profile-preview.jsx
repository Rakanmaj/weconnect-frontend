import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
export function ProfilePreview() {
    return (<div className="public-showcase-card">
      <div className="border-b border-border/80 bg-surface/60 px-5 py-3.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <div className="h-2 w-2 rounded-full bg-red-400 shrink-0"/>
          <div className="h-2 w-2 rounded-full bg-amber-400 shrink-0"/>
          <div className="h-2 w-2 rounded-full bg-green-400 shrink-0"/>
          <span className="text-caption ml-2 truncate">Developer profile</span>
        </div>
        <Badge variant="teal" size="sm" className="shrink-0">
          Preview
        </Badge>
      </div>

      <div className="p-5 lg:p-6">
        <div className="flex flex-col sm:flex-row sm:items-start gap-4">
          <div className="h-14 w-14 rounded-lg bg-navy flex items-center justify-center shrink-0">
            <span className="text-white text-lg font-semibold">YN</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-h3 text-foreground truncate">Your name</h3>
            <p className="text-body-sm text-muted mt-0.5 truncate">Your role</p>
            <span className="mt-2 inline-flex items-center gap-1 text-caption">
              <MapPin className="h-3 w-3 shrink-0"/>
              <span className="truncate">Your city</span>
            </span>
          </div>
        </div>
        <p className="mt-4 text-body-sm text-neutral-dark">Your verified skills, scores, and projects appear here after you complete them.</p>
      </div>
    </div>);
}
