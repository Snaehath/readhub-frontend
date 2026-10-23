"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail } from "lucide-react";

interface ResetPasswordFormProps {
  onBack: () => void;
}

export default function ResetPasswordForm({ onBack }: ResetPasswordFormProps) {
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
          Password recovery is temporarily unavailable while we configure email
          verification. This protects accounts from unauthorized password changes.
        </p>
      </CardHeader>

      <CardContent>
        <div className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-muted-foreground">
          <Mail size={18} aria-hidden="true" />
          <span>Contact support for help accessing your account.</span>
        </div>
        <Button type="button" variant="ghost" onClick={onBack} className="mt-4 w-full">
          <ArrowLeft size={18} />
          Back to login
        </Button>
      </CardContent>
    </Card>
  );
}
