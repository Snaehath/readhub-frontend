import LoginForm from "@/components/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center  px-4">
      <LoginForm />
      <Link
        href="/register"
        className=" text-primary hover:opacity-90 transition align-left"
      >
        New user
      </Link>
    </div>
  );
}
