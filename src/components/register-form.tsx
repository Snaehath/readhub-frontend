"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { PasswordInput } from "@/components/misc/password-input";
import { AvatarPicker } from "@/components/misc/avatar-picker";
import { avatarOptions } from "@/constants";
import { apiRequest } from "@/lib/api-client";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0].value);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Shown inline once the user has typed a confirmation.
  const mismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) return;
    setLoading(true);
    try {
      await apiRequest("/user/addUser", {
        method: "POST",
        body: { email, username, password, avatar },
        errorMessage: "Registration failed. Please try again.",
      });
      toast.success("Account created. Please sign in.");
      router.push("/login");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-xl shadow-lg">
      <CardHeader className="pb-2 text-center">
        <CardTitle className="text-2xl font-semibold text-primary">Create your ReadHub account</CardTitle>
        <CardDescription>Join the community of curious readers.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleRegister}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </Field>
            <Field>
              <FieldLabel htmlFor="username">Username</FieldLabel>
              <Input id="username" autoComplete="username" required maxLength={40} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your username" />
            </Field>
            <Field>
              <FieldLabel id="avatar-label">Choose an avatar</FieldLabel>
              <AvatarPicker value={avatar} onChange={setAvatar} size={60} aria-labelledby="avatar-label" />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <PasswordInput
                id="password"
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                aria-describedby="password-help"
              />
              <FieldDescription id="password-help">Use 10–72 characters.</FieldDescription>
            </Field>
            <Field data-invalid={mismatch || undefined}>
              <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
              <PasswordInput
                id="confirmPassword"
                autoComplete="new-password"
                required
                maxLength={72}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                aria-invalid={mismatch || undefined}
              />
              {mismatch && <FieldError>Passwords don&apos;t match.</FieldError>}
            </Field>
            <Button type="submit" className="w-full" disabled={loading || mismatch}>
              {loading && <Spinner />}
              {loading ? "Creating account…" : "Create account"}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
