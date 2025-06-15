"use client";

import { useState } from "react";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EyeClosed, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const avatarOptions = [
  {
    label: "Default Dev",
    value: "https://github.com/shadcn.png",
  },
  {
    label: "Detective",
    value: "https://cdn-icons-png.flaticon.com/512/3067/3067572.png",
  },
  {
    label: "Smart Nerd",
    value: "https://cdn-icons-png.flaticon.com/512/3360/3360125.png",
  },
  {
    label: "Reader Nerd",
    value: "https://cdn-icons-png.flaticon.com/512/3445/3445926.png",
  },
];

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState(avatarOptions[0].value);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://readhub-backend.onrender.com/api/user/adduser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password, avatar }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("User registered successfully!");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl border border-gray-200 rounded-2xl">
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl text-center font-semibold text-primary">
          Create your ReadHub account
        </CardTitle>
        <p className="text-sm text-center text-muted-foreground">
          Join the community of curious readers.
        </p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your username"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          <div>
            <Label>Select an Avatar</Label>
            <div className="flex flex-wrap gap-4 mt-2">
              {avatarOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setAvatar(opt.value)}
                  className={`rounded-full border-2 p-1 transition ${
                    avatar === opt.value
                      ? "border-primary ring ring-primary"
                      : "border-transparent"
                  }`}
                  aria-label={opt.label}
                  title={opt.label}
                >
                  <Image
                    src={opt.value}
                    alt={opt.label}
                    width={64}
                    height={64}
                    className="rounded-full"
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a password"
                className="pr-10 bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-2.5 text-muted-foreground hover:text-primary transition"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <Input
              id="confirmPassword"
              type={showPassword ? "text" : "password"}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="bg-white border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary"
            />
          </div>

          {/* <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              required
              className="accent-primary"
            />
            <Label htmlFor="terms" className="text-sm text-muted-foreground">
              I accept the terms and conditions
            </Label>
          </div> */}

          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
