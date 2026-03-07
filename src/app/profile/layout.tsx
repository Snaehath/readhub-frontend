import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Profile",
  description:
    "Manage your digital reading preferences, settings, and credentials.",
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
