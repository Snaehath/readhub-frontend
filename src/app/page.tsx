import Link from "next/link";
import { BookOpen, Newspaper } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FeaturedNews from "@/components/featured-news";
import FeaturedBooks from "@/components/featured-books";
export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-8">
      <section className="mb-12">
        <div className="text-center mb-8">
          <span className="flex justify-center items-center gap-2 mb-2">
            <h1 className="text-4xl font-bold tracking-tight">ReadHub</h1>
          <span className="w-15 h-10"><img
              src="Flippingbook.gif"
              alt="ReadHub logo"
              className=""
            /></span>
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
                Access thousands of news articles from trusted sources, all in
                one place.
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

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured News</h2>
        <FeaturedNews />
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-6">Featured E-Books</h2>
        <FeaturedBooks />
      </section>
    </main>
  );
}
