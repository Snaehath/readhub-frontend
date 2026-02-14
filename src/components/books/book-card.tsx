/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BookOpen } from "lucide-react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category, Book } from "@/types";
import { BOOK_CATEGORY_COLORS } from "@/constants";
import Typography from "../ui/custom/typography";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const categoryColor =
    BOOK_CATEGORY_COLORS[book.tag as Category] ||
    "bg-gray-200 text-gray-700 border-gray-300";

  return (
    <>
      <ul className="flex flex-col gap-4 sm:hidden">
        <li className="flex gap-4 p-2 rounded-md shadow hover:shadow-md transition">
          <div className="w-24 h-24 flex-shrink-0 relative">
            <img
              src={
                book.cover_edition_key
                  ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
                  : `https://placehold.co/200x200?text=${book.title}%0ABy%0A${book.author_name[0]}` ||
                    "/ReadHub_PlaceHolder.png"
              }
              onError={(e) => {
                e.currentTarget.src = "/ReadHub_PlaceHolder.png";
              }}
              className="w-full h-full object-contain rounded-md"
              alt={book.title}
            />
          </div>
          <div className="flex flex-col justify-between flex-1">
            <div>
              <h3 className="text-sm font-semibold line-clamp-2">
                {book.title}
              </h3>
              <p className="text-xs text-muted-foreground line-clamp-3 mt-1">
                by {book.author_name[0] ?? "finding"}
              </p>
            </div>
            <div className="flex justify-between mt-2">
              <div className="flex gap-2 items-center">
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  href={`https://archive.org/details/${book.lending_identifier_s}?view=theater`}
                  className="text-xs text-primary hover:underline"
                >
                  Read more
                </Link>
                <Link
                  href={`https://openlibrary.org/${book.work_key}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-primary hover:underline px-20"
                >
                  <BookOpen />
                </Link>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <Card className="overflow-hidden hidden sm:flex flex-col h-96 sm:w-auto hover:shadow-md hover:shadow-gray-500/50 ">
        <div className="relative h-48 w-full pb-2 pt-2">
          <img
            src={
              book.cover_edition_key
                ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
                : `https://placehold.co/200x200?text=${book.title}%0ABy%0A${book.author_name[0]}`
            }
            alt={book.title}
            className="object-contain w-full h-full "
          />
        </div>
        <CardHeader className="pl-3 py-2">
          <Badge
            variant="outline"
            className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${categoryColor}`}
          >
            <Typography variant="small">{book.tag.slice(0, 12)}</Typography>
          </Badge>
          <CardTitle className="text-md line-clamp-1">{book.title}</CardTitle>
          <p className="text-xs text-muted-foreground">
            by {book.author_name[0] ?? "finding"}
          </p>
        </CardHeader>
        <CardFooter className="p-3 pt-0 flex justify-between">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://archive.org/details/${book.lending_identifier_s}?view=theater`}
            className="text-sm font-medium text-primary hover:underline"
          >
            Read now
          </Link>
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={`https://openlibrary.org/${book.work_key}`}
            className="text-sm font-medium text-primary hover:underline"
          >
            <BookOpen />
          </Link>
        </CardFooter>
      </Card>
    </>
  );
}
