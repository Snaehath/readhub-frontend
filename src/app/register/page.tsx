import RegisterForm from "@/components/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4">
      <RegisterForm />
      <Link
        href="/login"
        className=" text-primary hover:opacity-90 transition align-left"
      >
        Existing user
      </Link>
    </div>
  );
}
