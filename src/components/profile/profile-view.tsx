"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import Link from "next/link";
import { format, isValid } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AvatarPicker } from "@/components/misc/avatar-picker";
import { PasswordInput } from "@/components/misc/password-input";
import { useUserStore } from "@/lib/store/userStore";
import { toast } from "sonner";
import { AlertTriangle, Edit2, User as UserIcon } from "lucide-react";
import { ProfileSkeleton } from "@/components/misc/skeletons";
import { useRouter } from "next/navigation";
import { NewsPreferencesCard } from "./news-preferences-card";
import { apiRequest } from "@/lib/api-client";

function Stat({ label, value, className }: { label: string; value: number; className?: string }) {
  return (
    <div className="rounded-2xl border bg-muted/40 p-3 text-center">
      <dd className={cn("text-2xl font-semibold tracking-tight", className)}>{value}</dd>
      <dt className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">{label}</dt>
    </div>
  );
}

const ProfileView = () => {
  const { user, setUser, status, fetchUser, logout } = useUserStore();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [newUsername, setNewUsername] = useState("");
  const [newAvatar, setNewAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [deletingAccount, setDeletingAccount] = useState(false);

  // Refresh counts (likes/bookmarks) when the profile opens.
  useEffect(() => {
    void fetchUser();
  }, [fetchUser]);

  const joinedDate = user?.createdAt && isValid(new Date(user.createdAt)) ? format(new Date(user.createdAt), "MMMM d, yyyy") : "";

  if (status === "loading") return <ProfileSkeleton />;

  if (!user) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4 p-4 text-center">
        <div className="rounded-full bg-muted p-4">
          <UserIcon className="h-12 w-12 text-muted-foreground" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-semibold tracking-tight">You&apos;re signed out</h3>
          <p className="text-sm text-muted-foreground">Sign in to view your profile.</p>
        </div>
        <Button asChild>
          <Link href="/login?next=/profile">Sign in</Link>
        </Button>
      </div>
    );
  }

  const startEditing = () => {
    setNewUsername(user.username || "");
    setNewAvatar(user.avatar || "");
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!newUsername.trim()) {
      toast.error("Username cannot be empty");
      return;
    }

    setLoading(true);
    try {
      const data = await apiRequest<{ user: { username: string; avatar: string } }>("/user/update", {
        method: "PUT",
        body: { username: newUsername.trim(), ...(newAvatar ? { avatar: newAvatar } : {}) },
        errorMessage: "Failed to update profile",
      });

      setUser({ ...user, username: data.user.username, avatar: data.user.avatar });

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

  const handleCancel = () => setIsEditing(false);

  const handleDeleteAccount = async () => {
    setDeletingAccount(true);
    try {
      await apiRequest("/user/account", { method: "DELETE", body: { password: deletePassword }, errorMessage: "Unable to delete the account." });
      await logout();
      toast.success("Your account and saved data were deleted.");
      router.replace("/");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to delete the account.");
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold tracking-tight">Your profile</h1>
      <div className="grid animate-in fade-in items-start gap-6 duration-500 lg:grid-cols-[minmax(0,380px)_minmax(0,1fr)]">
        <Card className="overflow-hidden border-2 rounded-3xl lg:sticky lg:top-24">
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
              <FieldGroup className="w-full animate-in slide-in-from-bottom-2 duration-300">
                <Field>
                  <FieldLabel htmlFor="username">Username</FieldLabel>
                  <InputGroup className="h-10 rounded-xl">
                    <InputGroupAddon>
                      <UserIcon aria-hidden="true" />
                    </InputGroupAddon>
                    <InputGroupInput id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} placeholder="Enter new username" maxLength={40} />
                  </InputGroup>
                </Field>
                <Field>
                  <FieldLabel id="profile-avatar-label">Avatar</FieldLabel>
                  <AvatarPicker value={newAvatar} onChange={setNewAvatar} size={52} aria-labelledby="profile-avatar-label" />
                </Field>
              </FieldGroup>
            ) : (
              <div className="space-y-1 text-center">
                <h2 className="text-3xl font-semibold tracking-tight">{user.username}</h2>
                <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
                <div className="flex flex-wrap justify-center gap-2 pt-3">
                  {joinedDate && (
                    <Badge variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-[11px] font-bold uppercase tracking-wider text-primary">
                      Member since {joinedDate}
                    </Badge>
                  )}
                  {user.role === "admin" && (
                    <Badge variant="outline" className="rounded-full border-amber-200 bg-amber-50 text-[11px] font-bold uppercase tracking-wider text-amber-700 dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-400">
                      Administrator
                    </Badge>
                  )}
                </div>

                <Separator className="mt-6" />
                <dl className="grid w-full grid-cols-2 gap-4 pt-6">
                  <Stat label="Liked articles" value={(user.likes_us?.length || 0) + (user.likes_in?.length || 0)} className="text-primary" />
                  <Stat label="Bookmarked articles" value={(user.bookmarks_us?.length || 0) + (user.bookmarks_in?.length || 0)} className="text-emerald-600 dark:text-emerald-400" />
                </dl>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-zinc-50/50 dark:bg-zinc-900/10 border-t p-4 flex flex-col gap-3">
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
                  {loading && <Spinner />}
                  {loading ? "Saving…" : "Save changes"}
                </Button>
              </div>
            ) : (
              <>
                <Button
                  onClick={startEditing}
                  className="w-full sm:w-auto px-12 rounded-full h-10 shadow-lg hover:shadow-indigo-500/20 transition-all font-bold"
                >
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="link" onClick={() => setDeleteDialogOpen(true)} className="text-destructive">Delete account</Button>
              </>
            )}
          </CardFooter>
        </Card>
        <NewsPreferencesCard />
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete your ReadHub account?</AlertDialogTitle>
              <AlertDialogDescription>This permanently deletes your account, chat history, likes, and bookmarks. Enter your password to confirm.</AlertDialogDescription>
            </AlertDialogHeader>
            <Field>
              <FieldLabel htmlFor="delete-account-password">Password</FieldLabel>
              <PasswordInput id="delete-account-password" autoComplete="current-password" value={deletePassword} onChange={(event) => setDeletePassword(event.target.value)} />
            </Field>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deletingAccount}>Cancel</AlertDialogCancel>
              {/* A plain Button (not AlertDialogAction) so the dialog stays open while the request runs. */}
              <Button variant="destructive" onClick={() => void handleDeleteAccount()} disabled={deletingAccount || !deletePassword}>
                {deletingAccount ? <Spinner /> : <AlertTriangle />}
                {deletingAccount ? "Deleting…" : "Delete account"}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProfileView;
