"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUserStore } from "@/lib/store/userStore";
import { avatarOptions } from "@/constants";
import { toast } from "sonner";
import { Edit2, User as UserIcon } from "lucide-react";

export default function ProfilePage() {
  const { user, setUser } = useUserStore(); // Zustand store
  const [joinedDate, setJoinedDate] = useState<string>("");
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?.createdAt) {
      const formatted = format(new Date(user.createdAt), "MMMM d, yyyy");
      setJoinedDate(formatted);
    }
    if (user) {
      setNewUsername(user.username);
      setNewAvatar(user.avatar);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-4">
        <div className="bg-muted p-4 rounded-full">
          <UserIcon className="w-12 h-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">User not found</h2>
          <p className="text-muted-foreground">
            Please log in to view your profile.
          </p>
        </div>
        <Button asChild>
          <a href="/login">Sign In</a>
        </Button>
      </div>
    );
  }

  const handleSave = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const token = localStorage.getItem("jwt");

      const response = await fetch(`${baseUrl}/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: newUsername,
          avatar: newAvatar,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Failed to update profile",
        );
      }

      // Update local store
      setUser({
        ...user,
        username: newUsername,
        avatar: newAvatar,
      });

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setNewUsername(user.username);
    setNewAvatar(user.avatar);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 overflow-hidden bg-zinc-50/30 dark:bg-transparent">
      <div className="w-full max-w-lg animate-in fade-in duration-500">
        <Card className="overflow-hidden border-2 rounded-3xl">
          <div className="h-28 bg-gradient-to-r from-indigo-600 via-indigo-500 to-primary" />
          <CardContent className="relative flex flex-col items-center pt-0 px-6 pb-6">
            <div className="relative -mt-14 mb-4">
              <Avatar className="h-28 w-28 ring-4 ring-background shadow-2xl transition-transform hover:scale-105 duration-300">
                <AvatarImage
                  src={isEditing ? newAvatar : user.avatar}
                  alt={user.username}
                />
                <AvatarFallback className="text-2xl font-bold bg-indigo-50 text-indigo-600">
                  {user.username?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            {isEditing ? (
              <div className="w-full space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-2">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="username"
                      className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1"
                    >
                      Username
                    </Label>
                    <div className="relative">
                      <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="pl-10 h-10 rounded-xl"
                        placeholder="Enter new username"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground ml-1">
                      Select Avatar
                    </Label>
                    <div className="grid grid-cols-4 gap-3">
                      {avatarOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setNewAvatar(opt.value)}
                          className={`relative rounded-xl border-2 p-1 transition-all hover:scale-105 active:scale-95 ${
                            newAvatar === opt.value
                              ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-md"
                              : "border-zinc-100 dark:border-zinc-800 hover:border-indigo-200"
                          }`}
                        >
                          <Image
                            src={opt.value}
                            alt={opt.label}
                            width={60}
                            height={60}
                            className="rounded-lg object-cover mx-auto"
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-1">
                <h2 className="text-2xl font-bold tracking-tight">
                  {user.username}
                </h2>
                <p className="text-muted-foreground font-medium text-sm">
                  {user.email}
                </p>
                <div className="pt-3">
                  <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold rounded-full border border-indigo-100 dark:border-indigo-900/50 uppercase tracking-wider">
                    Member since {joinedDate}
                  </span>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/10 border-t p-4 flex justify-center">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 rounded-xl h-10 hover:bg-zinc-200 dark:hover:bg-zinc-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1 rounded-xl h-10 shadow-lg shadow-indigo-500/20"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => setIsEditing(true)}
                className="w-full sm:w-auto px-12 rounded-full h-10 shadow-lg hover:shadow-indigo-500/20 transition-all font-bold"
              >
                <Edit2 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
