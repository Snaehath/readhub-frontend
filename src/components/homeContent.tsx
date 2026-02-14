"use client";
import Link from "next/link";
import { BookOpen, Newspaper } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Image from "next/image";

export default function HomeContent() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <span className="flex justify-center items-center gap-2 mb-2">
          <h1 className="text-4xl font-bold tracking-tight">ReadHub</h1>
          <span className="w-15 h-10">
            <Image
              src="/home_images/Flippingbook.gif"
              alt="ReadHub logo"
              width={100}
              height={100}
            />
          </span>
        </span>
        <p className="text-xl text-muted-foreground">
          Your digital reading companion
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Newspaper className="h-5 w-5" />
              News Articles
            </CardTitle>
            <CardDescription>
              Stay updated with the latest news from around the world
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Access thousands of news articles from trusted sources, all in one
              place.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/news">Browse News</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              E-Book Library
            </CardTitle>
            <CardDescription>
              Discover and read books from various genres
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>
              Enjoy a vast collection of e-books that you can read anytime,
              anywhere.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild>
              <Link href="/library">Browse E-Books</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
