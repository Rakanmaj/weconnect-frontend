import Link from "@/router";
import { useRouter, useSearchParams } from "@/router";
import { AuthError, loginDestination, useAuth } from "@/lib/auth";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Logo, BrandTagline } from "@/components/brand/logo";
export default function AdminLoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const auth = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));
        setLoading(true);
        setError("");
        try {
            const user = await auth.login({ ...data, role: "admin" });
            router.replace(loginDestination(searchParams.get("next"), user.role));
        } catch (error) { setError(error.message); }
        finally { setLoading(false); }
    };
    return (<div className="flex min-h-screen items-center justify-center bg-[#0A1628] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex flex-col items-center gap-3 mb-2">
            <Logo iconSize={40} inverted/>
            <BrandTagline inverted/>
          </Link>
          <h1 className="text-h2 text-white mt-4">Admin Portal</h1>
          <p className="text-body-sm text-gray-400 mt-1">WeConnect platform administration</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <AuthError message={error || auth.sessionError} />
              <div className="space-y-2">
                <Label htmlFor="email">Admin email</Label>
                <Input id="email" name="email" autoComplete="username" type="email" placeholder="admin@email.com" required/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" autoComplete="current-password" type="password" placeholder="Your password" required/>
              </div>
              <Button type="submit" className="w-full" loading={loading}>
                Sign in
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-caption text-gray-500">
          <Link href="/" className="hover:text-gray-300">
            ← Back to WeConnect
          </Link>
        </p>
      </div>
    </div>);
}
