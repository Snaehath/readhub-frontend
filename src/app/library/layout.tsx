import { Metadata } from "next";

export const metadata: Metadata = {
  title: "E-Book Archive",
  description:
    "Browse an expansive library of digital books across every genre.",
};

export default function LibraryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
