import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-4 text-center">
        <LoginForm />
        <Link
          href="/register"
          className="block text-sm text-muted-foreground hover:text-primary transition"
        >
          New user? Create an account
        </Link>
      </div>
    </div>
  );
}
