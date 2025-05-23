"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-50 border-b bg-background shadow-sm backdrop-blur-lg transition-all">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo & Desktop Navbar */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-2xl font-extrabold tracking-tight text-primary hover:opacity-90 transition"
          >
            ReadHub
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {[
              { href: "/news", label: "News", icon: <Newspaper className="h-4 w-4" /> },
              { href: "/library", label: "E-Books", icon: <BookOpen className="h-4 w-4" /> },
              { href: "/chatbot", label: "ChatBot", icon: "🤖" },
            ].map(({ href, label, icon }) => (
              <Link
                key={href}
                href={href}
                className={`relative flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary group ${
                  isActive(href) ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {icon}
                {label}
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full ${
                    isActive(href) ? "w-full" : ""
                  }`}
                />
              </Link>
            ))}
          </nav>
        </div>

        {/* Right: Avatar, ThemeToggle, small-device: Menu Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Avatar */}
          <div className="hidden md:block">
            <Avatar className="ring-2 ring-primary ring-offset-2 ring-offset-background hover:scale-105 transition">
              <AvatarImage src="https://github.com/shadcn.png" alt="user" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu */}
          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>

            <DrawerContent className="pt-6 pb-10">
              <DrawerTitle className="px-4 text-lg font-semibold text-primary">
                Menu
              </DrawerTitle>
              <DrawerDescription className="px-4 text-sm text-muted-foreground">
                Navigate through the app
              </DrawerDescription>

              <nav className="flex flex-col gap-6 px-6 py-4">
                {[
                  { href: "/news", label: "News", icon: <Newspaper className="h-5 w-5" /> },
                  { href: "/library", label: "E-Books", icon: <BookOpen className="h-5 w-5" /> },
                  { href: "/chatbot", label: "ChatBot", icon: "🤖" },
                ].map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-2 text-lg font-medium transition-colors hover:text-primary ${
                      isActive(href) ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {icon}
                    {label}
                  </Link>
                ))}

                {/* Avatar in Mobile */}
                <div className="pt-6">
                  <Avatar className="ring-2 ring-primary ring-offset-2 ring-offset-background hover:scale-105 transition">
                    <AvatarImage src="https://github.com/shadcn.png" alt="user" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                </div>
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
