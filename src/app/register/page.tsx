import RegisterForm from "@/components/register-form";
import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <Link
          href="/login"
          className="block text-sm text-center text-muted-foreground hover:text-primary transition"
        >
          Already have an account? Sign in
        </Link>
      </div>
    </div>
  );
}
