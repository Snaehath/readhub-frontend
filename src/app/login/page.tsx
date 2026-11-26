import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import LoginForm from "@/components/login-form";

export const metadata: Metadata = { title: "Sign in" };

export default function LoginPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <Suspense>
          <LoginForm />
        </Suspense>
        <Link href="/register" className="block text-center text-sm text-muted-foreground transition hover:text-primary">
          New to ReadHub? Create a free account
        </Link>
      </div>
    </div>
  );
}
