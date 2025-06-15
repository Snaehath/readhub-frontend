"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserStore } from "@/lib/store/userStore";

export default function ProfilePage() {
  const { user } = useUserStore(); // Zustand store
  const [joinedDate, setJoinedDate] = useState<string>("");

  useEffect(() => {
    if (user?.createdAt) {
      const formatted = format(new Date(user.createdAt), "MMMM d, yyyy");
      setJoinedDate(formatted);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        User not found. Please log in.
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <Avatar className="h-24 w-24 ring-2 ring-primary ring-offset-2 ring-offset-background">
            <AvatarImage src={user.avatar} alt={user.username} />
            <AvatarFallback>
              {user.username?.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="text-lg font-semibold">{user.username}</div>
          <div className="text-muted-foreground">{user.email}</div>
          <div className="text-sm text-muted-foreground">
            Joined on <span className="font-medium">{joinedDate}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
