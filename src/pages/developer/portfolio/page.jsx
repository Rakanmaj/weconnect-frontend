import Link from "@/router";
import { MapPin, Briefcase, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/developer/card";
import { Avatar } from "@/components/ui/avatar";
import { VerifiedBadge } from "@/components/ui/verified-badge";
import { PerformanceMetric } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth";
export default function PortfolioPage() {
    const { user } = useAuth();
    const name = user?.name || "Your name";
    const role = user?.developer?.preferredPosition || "Add your role on your profile";
    const location = user?.developer?.location || "Add your location";
    return (<div className="min-w-0">
      {/* Hero */}
      <div className="rounded-[14px] bg-gradient-to-br from-navy to-[#1a3a6e] text-white p-6 sm:p-10 mb-8 overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"/>
        <div className="relative flex flex-col sm:flex-row gap-6 items-start">
          <Avatar name={name} size="lg" className="h-20 w-20 text-2xl ring-4 ring-white/20"/>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h1 className="text-h1 text-white truncate">{name}</h1>
              {user?.verificationStatus === "verified" && <VerifiedBadge type="account" className="text-teal"/>}
            </div>
            <p className="text-body-lg text-white/80">{role}</p>
            <p className="text-body-sm text-white/60 flex items-center gap-1.5 mt-2">
              <MapPin className="h-4 w-4 shrink-0"/>
              {location}
            </p>
          </div>
          <Button variant="secondary" size="sm" className="shrink-0" asChild>
            <Link href="/developer/profile">Edit Profile</Link>
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h2 className="text-h3 text-foreground mb-3">About</h2>
            <p className="text-body-sm text-muted">Your about section appears here after you save it on your profile.</p>
          </Card>

          <Card>
            <h2 className="text-h3 text-foreground mb-4">Verified Skills</h2>
            <div className="flex flex-wrap gap-2">
              <p className="text-body-sm text-muted">Verified skills appear after you pass skill challenges.</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-h3 text-foreground mb-4">Featured Projects</h2>
            <p className="text-body-sm text-muted">Completed company projects will be listed here.</p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <h2 className="text-h4 text-foreground mb-4">Performance</h2>
            <div className="grid grid-cols-2 gap-4">
              <PerformanceMetric label="Reliability" value="—"/>
              <PerformanceMetric label="Avg Score" value="—"/>
              <PerformanceMetric label="Projects" value="0"/>
              <PerformanceMetric label="Evaluations" value="0"/>
            </div>
          </Card>

          <Card>
            <h2 className="text-h4 text-foreground mb-4">Links</h2>
            <div className="space-y-3">
              <p className="text-body-sm text-muted">Add GitHub and portfolio links on your profile.</p>
            </div>
          </Card>

          <Card>
            <h2 className="text-h4 text-foreground mb-3">Availability</h2>
            <p className="text-body-sm text-muted">Set your availability in settings.</p>
          </Card>

          <div className="flex flex-col gap-2">
            <Button variant="secondary" asChild>
              <Link href="/developer/level"><Award className="h-4 w-4"/> Level Progression</Link>
            </Button>
            <Button variant="secondary" asChild>
              <Link href="/developer/projects"><Briefcase className="h-4 w-4"/> View Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>);
}
