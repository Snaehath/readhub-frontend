/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { avatarOptions, API_BASE_URL } from "@/constants";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0].value);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, avatar }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) throw new Error(data?.error || "Registration failed. Please try again.");

      toast.success("Account created. Please sign in.");
      router.push("/login");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full rounded-xl shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-center font-semibold text-primary">
          Create your ReadHub account
        </CardTitle>
        <p className="text-sm text-center text-muted-foreground">
          Join the community of curious readers.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-muted-foreground block mb-1.5"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
             
            />
          </div>

          <div>
            <Label
              htmlFor="username"
              className="text-sm font-medium text-muted-foreground block mb-1.5"
            >
              Username
            </Label>
            <Input
              id="username"
              autoComplete="username"
              required
              maxLength={40}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
             
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-muted-foreground block mb-1.5">
              Select an Avatar
            </Label>
            <div className="flex flex-wrap justify-center gap-4 mt-2">
              {avatarOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAvatar(opt.value)}
                  className={`rounded-full border-2 p-1 transition ${
                    avatar === opt.value
                      ? "border-primary ring ring-primary"
                      : "border-transparent"
                  }`}
                  aria-label={opt.label}
                  aria-pressed={avatar === opt.value}
                  title={opt.label}
                >
                  <img
                    src={opt.value}
                    alt={opt.label}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label
              htmlFor="password"
              className="text-sm font-medium text-muted-foreground block mb-1.5"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={10}
                maxLength={72}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Use 10–72 characters for your password.
            </p>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-muted-foreground block mb-1.5"
            >
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
             
            />
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Creating account…" : "Create account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
