"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "./ui/drawer";
export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Select Theme</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 flex flex-col gap-2">
          <Button variant="ghost" className="border border-gray-400/30" onClick={() => setTheme("light")}>
            Light
          </Button>
          <Button variant="ghost" className="border border-gray-400/30" onClick={() => setTheme("dark")}>
            Dark
          </Button>
          <Button variant="ghost" className="border border-gray-400/30" onClick={() => setTheme("system")}>
            System
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
