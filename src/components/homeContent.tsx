"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { BookOpen, Newspaper } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";

export default function HomeContent() {
  return (
    <section className="mb-12">
      <div className="text-center mb-8">
        <span className="flex justify-center items-center gap-2 mb-2">
          <h1 className="text-4xl font-bold tracking-tight">ReadHub</h1>
          <span className="w-15 h-10">
            <img src="Flippingbook.gif" alt="ReadHub logo" />
          </span>
        </span>
        <p className="text-xl text-muted-foreground">
          Your digital reading companion
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
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
            <Button asChild className="w-full">
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
            <Button asChild className="w-full">
              <Link href="/library">Browse E-Books</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
