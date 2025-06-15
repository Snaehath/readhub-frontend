"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, Newspaper } from "lucide-react";
import { useRouter } from "next/navigation";

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
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const user = useUserStore((state) => state.user);
  const logout = useUserStore((state) => state.logout);

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout(); // Clear Zustand store
    router.push("/");

    toast("Logged out successfully!");
  };

  const isLoggedIn = !!user;

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
              {
                href: "/news",
                label: "News",
                icon: <Newspaper className="h-4 w-4" />,
              },
              {
                href: "/library",
                label: "E-Books",
                icon: <BookOpen className="h-4 w-4" />,
              },
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

        {/* Right: Avatar, ThemeToggle, Login/Logout, Menu Button */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Desktop Avatar */}
          {isLoggedIn && (
            <div
              className="hidden md:block cursor-pointer"
              onClick={() => router.push("/profile")}
              title="View Profile"
            >
              <Avatar className="ring-2 ring-primary ring-offset-2 ring-offset-background hover:scale-105 transition">
                <AvatarImage src={user?.avatar} alt={user?.username} />
                <AvatarFallback>
                  {user?.username?.slice(0, 2).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          )}

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Login/Logout Button */}
          {isLoggedIn ? (
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white transition"
            >
              Logout
            </Button>
          ) : (
            <Button asChild>
              <Link
                href="/login"
                className="px-6 py-2 rounded-md bg-blue-600 hover:bg-blue-700 font-medium transition duration-200"
              >
                Login
              </Link>
            </Button>
          )}

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
                  {
                    href: "/news",
                    label: "News",
                    icon: <Newspaper className="h-5 w-5" />,
                  },
                  {
                    href: "/library",
                    label: "E-Books",
                    icon: <BookOpen className="h-5 w-5" />,
                  },
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
                {isLoggedIn && (
                  <div
                    className="pt-6 cursor-pointer"
                    onClick={() => router.push("/profile")}
                  >
                    <Avatar className="ring-2 ring-primary ring-offset-2 ring-offset-background hover:scale-105 transition">
                      <AvatarImage src={user?.avatar} alt={user?.username} />
                      <AvatarFallback>
                        {user?.username?.slice(0, 2).toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </nav>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
