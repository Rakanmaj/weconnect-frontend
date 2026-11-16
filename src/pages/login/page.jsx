import { useState } from "react";
import Link from "@/router";
import { useRouter, useSearchParams } from "@/router";
import { AuthError, loginDestination, useAuth } from "@/lib/auth";
import { Building2, Code2, ShieldCheck } from "lucide-react";
import { ImmersiveAuthLayout } from "@/components/auth/immersive-auth-layout";
import { LoginNetworkVisual } from "@/components/auth/auth-visuals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auth = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const initialRole = searchParams.get("next")?.startsWith("/company/") ? "company" : "developer";
    const [role, setRole] = useState(initialRole);
    const [email, setEmail] = useState(searchParams.get('email') || "");
    const [password, setPassword] = useState("");
    function chooseRole(nextRole) {
        setRole(nextRole);
    }
    async function signIn(credentials) {
        setLoading(true);
        setError("");
        try {
            const user = await auth.login(credentials);
            router.replace(loginDestination(searchParams.get("next"), user.role));
        } catch (error) { setError(error.message); }
        finally { setLoading(false); }
    }
    function handleSubmit(e) {
        e.preventDefault();
        void signIn({ role, email, password });
    }
    return (<ImmersiveAuthLayout eyebrow="Enter the network" title="Welcome back" description="Access your verified work, opportunities, and hiring network." theme="mixed" compact converging={loading} visual={<LoginNetworkVisual active={loading}/>} footer={<>
          New to WeConnect?{" "}
          <Link href="/register" className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </>}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthError message={error || auth.sessionError} />
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Choose account type</p>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Demo account type">
            {([
            { id: "developer", label: "Developer", icon: Code2 },
            { id: "company", label: "Company", icon: Building2 },
        ]).map(({ id, label, icon: Icon }) => (<button key={id} type="button" disabled={loading} onClick={() => chooseRole(id)} className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm font-semibold transition-colors ${role === id
                ? "border-primary bg-primary text-white"
                : "border-navy/[0.08] bg-white/55 text-navy/70 hover:border-navy/20 hover:bg-white"}`}>
                <Icon className="h-4 w-4"/>
                {label}
              </button>))}
          </div>
          <p className="text-[11px] text-muted">Sign in with your developer or company account.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" required>
            Email
          </Label>
          <Input id="email" name="email" type="email" required autoComplete="email" placeholder="name@email.com" value={email} onChange={(event) => setEmail(event.target.value)} className="h-11 rounded-xl bg-white"/>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" required>
              Password
            </Label>
            <Link href="/login/forgot-password" className="text-[11px] font-medium text-navy/48 transition-colors hover:text-teal hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input id="password" name="password" type="password" required autoComplete="current-password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.target.value)} className="h-11 rounded-xl bg-white"/>
        </div>

        <Button type="submit" className="auth-primary-cta h-11 w-full rounded-xl" loading={loading}>
          Continue as {role === "developer" ? "Developer" : "Company"}
        </Button>

        <Button variant="ghost" className="w-full" asChild>
          <Link href="/admin/login"><ShieldCheck className="h-4 w-4"/> Open admin sign in</Link>
        </Button>
      </form>
    </ImmersiveAuthLayout>);
}
