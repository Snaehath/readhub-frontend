import RegisterForm from "@/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="space-y-4 text-center">
        <RegisterForm />
        <Link
          href="/login"
          className="block text-sm text-muted-foreground hover:text-primary transition"
        >
          Existing user? Log in
        </Link>
      </div>
    </div>
  );
}
