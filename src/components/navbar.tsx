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
    <header className="border-b sticky top-0 z-50 bg-background">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between lg:m-0">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex font-bold text-xl">
            ReadHub
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/news"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/news") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              News
            </Link>
            <Link
              href="/library"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/library") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              E-Books
            </Link>
            <Link
              href="/chatbot"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive("/chatbot") ? "text-primary" : "text-muted-foreground"
              }`}
            >
              ChatBot
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex relative w-full max-w-sm items-center">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="user" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
          </div>

          <ThemeToggle />

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerTitle className=" pl-3 text-lg font-semibold">
                Menu
              </DrawerTitle>
              <DrawerDescription className=" pl-3">
                Navigate through the main sections
              </DrawerDescription>

              <nav className="flex flex-col gap-4 p-6">
                <Link
                  href="/news"
                  className={`flex items-center gap-2 text-lg font-medium ${
                    isActive("/news") ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <Newspaper className="h-5 w-5" />
                  News
                </Link>
                <Link
                  href="/library"
                  className={`flex items-center gap-2 text-lg font-medium ${
                    isActive("/library")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  <BookOpen className="h-5 w-5" />
                  E-Books
                </Link>
                <Link
                  href="/chatbot"
                  className={`flex items-center gap-2 text-lg font-medium ${
                    isActive("/chatbot")
                      ? "text-primary"
                      : "text-muted-foreground"
                  }`}
                >
                  🤖 ChatBot
                </Link>
                <div className="relative w-full mt-4">
                  <Avatar>
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="user"
                    />
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
