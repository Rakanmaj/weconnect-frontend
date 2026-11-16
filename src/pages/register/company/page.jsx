import { useState } from "react";
import Link from "@/router";
import { useRouter } from "@/router";
import { AuthError, useAuth } from "@/lib/auth";
import { ImmersiveAuthLayout } from "@/components/auth/immersive-auth-layout";
import { CompanyNetworkPreview } from "@/components/auth/auth-visuals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
const companySizes = ["1-10", "11-50", "50-200", "200-500", "500+"];
export default function RegisterCompanyPage() {
    const auth = useAuth();
    const router = useRouter();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [companyName, setCompanyName] = useState("");
    const [industry, setIndustry] = useState("");
    const [companySize, setCompanySize] = useState("");
    async function handleSubmit(e) {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setLoading(true);
        setError("");
        try {
            await auth.register({ ...data, role: "company" });
            router.replace("/company/verification?status=pending");
        } catch (error) { setError(error.message); }
        finally { setLoading(false); }
    }
    return (<ImmersiveAuthLayout eyebrow="Discover proven talent" title="Create company account" description="Establish your company node and start building a performance-based hiring network." theme="teal" formSide="left" compact visual={<CompanyNetworkPreview companyName={companyName} industry={industry} size={companySize}/>} footer={<>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-primary hover:underline">
            Sign in
          </Link>
        </>}>
      <form onSubmit={handleSubmit} className="space-y-4">
          <AuthError message={error} />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="companyName" required>
                Company name
              </Label>
              <Input id="companyName" name="companyName" required placeholder="Company name" value={companyName} onChange={(event) => setCompanyName(event.target.value)} className="h-10 rounded-xl"/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="website" required>
                Website
              </Label>
              <Input id="website" name="website" type="url" required placeholder="https://company.com" className="h-10 rounded-xl"/>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="industry" required>
                Industry
              </Label>
              <Input id="industry" name="industry" required placeholder="Industry" value={industry} onChange={(event) => setIndustry(event.target.value)} className="h-10 rounded-xl"/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="size" required>
                Company size
              </Label>
              <select id="size" name="size" required value={companySize} onChange={(event) => setCompanySize(event.target.value)} className="flex h-10 w-full rounded-xl border border-border bg-card px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                <option value="">Select size</option>
                {companySizes.map((size) => (<option key={size} value={size}>
                    {size} employees
                  </option>))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="location" required>
                Location
              </Label>
              <Input id="location" name="location" required placeholder="City, country" className="h-10 rounded-xl"/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="email" required>
                Work email
              </Label>
              <Input id="email" name="email" type="email" required placeholder="name@company.com" className="h-10 rounded-xl"/>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="contactName" required>
                Contact name
              </Label>
              <Input id="contactName" name="contactName" required placeholder="Contact name" className="h-10 rounded-xl"/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contactTitle" required>
                Job title
              </Label>
              <Input id="contactTitle" name="contactTitle" required placeholder="Job title" className="h-10 rounded-xl"/>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="about">About your company</Label>
            <Textarea id="about" name="about" placeholder="What your company does" rows={2} className="min-h-16 rounded-xl"/>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="password" required>
                Password
              </Label>
              <Input id="password" name="password" type="password" required minLength={8} placeholder="At least 8 characters" className="h-10 rounded-xl"/>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" required>
                Confirm password
              </Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} placeholder="Repeat your password" className="h-10 rounded-xl"/>
            </div>
          </div>

          <p className="text-[11px] leading-4 text-muted">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
            .
          </p>

          <Button type="submit" className="auth-primary-cta h-11 w-full rounded-xl" loading={loading}>
            Create company account
          </Button>

          <p className="text-center text-xs text-muted">
            Looking to join as a developer?{" "}
            <Link href="/register/developer" className="text-primary hover:underline">
              Register as developer
            </Link>
          </p>
      </form>
    </ImmersiveAuthLayout>);
}
