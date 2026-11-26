"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BookOpen, Bot, LogOut, Menu, Newspaper, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { ThemeToggle } from "@/components/misc/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserStore } from "@/lib/store/userStore";
import ToolTip from "@/components/ui/custom/tooltip";

const NAV_ITEMS = [
  { href: "/news", label: "News", icon: Newspaper },
  { href: "/library", label: "Books", icon: BookOpen },
  { href: "/ai-news", label: "AI Reports", icon: Sparkles },
  { href: "/chatbot", label: "AI Assistant", icon: Bot },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const status = useUserStore((state) => state.status);
  const logout = useUserStore((state) => state.logout);

  const isActive = (path: string) => pathname === path || pathname.startsWith(`${path}/`);
  const initials = user?.username?.slice(0, 2).toUpperCase() || "U";

  const handleLogout = async () => {
    await logout();
    router.push("/");
    toast.success("Signed out.");
  };

  const signInHref = pathname && pathname !== "/" && pathname !== "/login" ? `/login?next=${encodeURIComponent(pathname)}` : "/login";

  return (
    <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold tracking-tight text-primary">ReadHub</Link>
          <nav aria-label="Main" className="hidden items-center gap-6 md:flex">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${isActive(href) ? "text-primary" : "text-muted-foreground"}`}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {/* Reserve space while the session check runs to avoid a sign-in button flash. */}
          <div className="hidden min-w-[88px] items-center justify-end gap-2 md:flex">
            {user ? (
              <>
                <ToolTip content="Your profile">
                  <Link href="/profile" aria-label="Your profile" className="rounded-full">
                    <Avatar className="ring-2 ring-primary/60 ring-offset-2 ring-offset-background">
                      <AvatarImage src={user.avatar} alt="" />
                      <AvatarFallback>{initials}</AvatarFallback>
                    </Avatar>
                  </Link>
                </ToolTip>
                <ToolTip content="Sign out">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => void handleLogout()}
                    aria-label="Sign out"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive focus-visible:ring-destructive/40"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </ToolTip>
              </>
            ) : status !== "loading" ? (
              <Button asChild><Link href={signInHref}>Sign in</Link></Button>
            ) : null}
          </div>

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </DrawerTrigger>
            <DrawerContent className="pb-8 pt-4">
              <DrawerTitle className="px-6 text-lg font-semibold">Menu</DrawerTitle>
              <DrawerDescription className="sr-only">Site navigation</DrawerDescription>
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 py-4">
                {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
                  <DrawerClose asChild key={href}>
                    <Link
                      href={href}
                      aria-current={isActive(href) ? "page" : undefined}
                      className={`flex min-h-12 items-center gap-3 rounded-lg px-3 text-base font-medium hover:bg-accent ${isActive(href) ? "text-primary" : "text-foreground"}`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      {label}
                    </Link>
                  </DrawerClose>
                ))}
              </nav>
              <div className="border-t px-4 pt-4">
                {user ? (
                  <div className="flex items-center justify-between gap-3">
                    <DrawerClose asChild>
                      <Link href="/profile" className="flex min-h-12 items-center gap-3 rounded-lg px-3 hover:bg-accent">
                        <Avatar>
                          <AvatarImage src={user.avatar} alt="" />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{user.username}</span>
                      </Link>
                    </DrawerClose>
                    <DrawerClose asChild>
                      <Button variant="outline" onClick={() => void handleLogout()} className="border-destructive/40 text-destructive hover:bg-destructive/10 hover:text-destructive">
                        <LogOut className="mr-2 h-4 w-4" /> Sign out
                      </Button>
                    </DrawerClose>
                  </div>
                ) : (
                  <DrawerClose asChild>
                    <Button asChild className="w-full"><Link href={signInHref}>Sign in</Link></Button>
                  </DrawerClose>
                )}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </header>
  );
}
