"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/misc/password-input";
import { useUserStore } from "@/lib/store/userStore";
import { apiRequest } from "@/lib/api-client";

/** Only allow same-site relative redirects to avoid open-redirects via ?next=. */
const safeNextPath = (value: string | null) => (value && value.startsWith("/") && !value.startsWith("//") ? value : "/");

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const fetchUser = useUserStore((state) => state.fetchUser);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      await apiRequest("/user/login", { method: "POST", body: { email, password }, errorMessage: "Sign-in failed. Please try again." });
      await fetchUser();
      toast.success("Signed in.");
      router.replace(safeNextPath(searchParams.get("next")));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-xl shadow-lg">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
        <CardDescription>Sign in to use the AI tools and your saved stories.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLogin}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput id="password" autoComplete="current-password" required maxLength={72} value={password} onChange={(e) => setPassword(e.target.value)} />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Spinner />}
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
