import Link from "next/link";

import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getFeaturedBooks } from "@/lib/data";

export default async function FeaturedBooks() {
 
  const featuredBooks = await getFeaturedBooks();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {featuredBooks.map((book,i) => (
        <Card key={i} className="overflow-hidden flex flex-col">
          <div className="relative h-64 w-full">
          <img
              src={book.urlToImage}
              alt={book.title}

              className="object-contain w-full h-full outline outline-black p-2"
            />
          </div>
          <CardHeader className="p-4">
            <Badge className="w-fit mb-2">{book.category}</Badge>
            <CardTitle className="text-base line-clamp-2">
              {book.title}
            </CardTitle>
            <p className="text-sm text-muted-foreground">by {book.author.name}</p>
          </CardHeader>
          
          <CardFooter className="p-4 pt-0 flex justify-between">
            <Link
              href={book.url}
              className="text-sm font-medium text-primary hover:underline"
            >
              Read now
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
