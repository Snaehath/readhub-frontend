import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ask AI",
  description: "Chat with your intelligent reading companion.",
};

export default function ChatbotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
