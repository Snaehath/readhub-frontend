"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";
import ResetPasswordForm from "./reset-password-form";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false);

  const router = useRouter();
  const { setToken, fetchUser } = useUserStore();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }
      setToken(data.token);
      await fetchUser();
      toast.success("Logged in successfully!");
      router.push("/");
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

  if (showReset) {
    return <ResetPasswordForm onBack={() => setShowReset(false)} />;
  }

  return (
    <Card className="w-full border border-gray-200 shadow-lg rounded-xl animate-in fade-in slide-in-from-left-4 duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-center font-semibold text-primary">
          Welcome back 👋
        </CardTitle>
        <p className="text-sm text-center text-muted-foreground">
          Login to ReadHub
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <Label
              htmlFor="email"
              className="text-sm font-medium text-muted-foreground"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label
                htmlFor="password"
                className="text-sm font-medium text-muted-foreground"
              >
                Password
              </Label>
              <button
                type="button"
                onClick={() => setShowReset(true)}
                className="text-xs text-primary font-bold hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="pr-10 bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-primary transition"
              >
                {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
