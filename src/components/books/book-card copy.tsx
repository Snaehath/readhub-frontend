/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookCopy } from "@/types";

interface BookCardProps {
  book: BookCopy;
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-96 sm:w-auto hover:shadow-md hover:shadow-gray-500/50 ">
      <div className="relative h-48 w-full">
        <img src={book.coverImage} alt="Book cover" className="object-contain w-full h-full p-2" />
      </div>
      <CardHeader className="pl-3">
        <Badge className="w-fit mb-1 text-xs">{book.tag.slice(0, 12)}</Badge>
        <CardTitle className="text-md line-clamp-1">{book.title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          by {book.author_name ?? "finding"}
        </p>
      </CardHeader>
      <CardFooter className="p-3 pt-0 flex justify-between">
        <Link
          target="_blank"
          rel="noopener noreferrer"
          href={book.readUrl}
          className="text-sm font-medium text-primary hover:underline"
        >
          Read now
        </Link>
      </CardFooter>
    </Card>
  );
}
