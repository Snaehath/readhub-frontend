"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";

interface ResetPasswordFormProps {
  onBack: () => void;
}

export default function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/user/reset-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Reset failed");
      }

      toast.success("Password reset successfully! You can now login.");
      onBack();
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
    <Card className="w-full border border-gray-200 shadow-lg rounded-xl animate-in fade-in slide-in-from-right-4 duration-300">
      <CardHeader>
        <div className="flex items-center gap-3 mb-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full h-9 w-9 hover:bg-gray-100 -ml-2"
          >
            <ArrowLeft size={20} />
          </Button>
          <CardTitle className="text-2xl font-bold text-primary tracking-tight">
            Reset Password
          </CardTitle>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Forgot your password? Enter your registered email and new password to
          recover your account.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleReset} className="space-y-4">
          <div>
            <Label
              htmlFor="reset-email"
              className="text-sm font-medium text-muted-foreground pb-2"
            >
              Registered Email
            </Label>
            <Input
              id="reset-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label
              htmlFor="new-password"
              className="text-sm font-medium text-muted-foreground pb-2"
            >
              New Password
            </Label>
            <Input
              id="new-password"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label
              htmlFor="confirm-password"
              className="text-sm font-medium text-muted-foreground pb-2"
            >
              Confirm New Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <Button
            type="submit"
            className="w-full mt-2 gap-2"
            disabled={loading}
          >
            <KeyRound size={18} />
            {loading ? "Resetting..." : "Reset Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
