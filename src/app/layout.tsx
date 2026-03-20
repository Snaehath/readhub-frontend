import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import Navbar from "@/components/navbar";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/sonner";
import { AuthMonitor } from "@/components/auth/auth-monitor";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: "%s | ReadHub",
    default: "ReadHub | Your Digital Reading Companion",
  },
  description:
    "Explore thousands of news articles, timeless e-books, and original AI-generated stories.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen flex flex-col">
            <AuthMonitor />
            <Navbar />
            <div className="flex-1">{children}</div>
            <Analytics />
            <Toaster />
            <footer className="border-t py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                2025 ReadHub
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
