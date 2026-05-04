/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { BookOpen, ExternalLink } from "lucide-react";

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Category, Book } from "@/types";
import { BOOK_CATEGORY_COLORS } from "@/constants";
import ToolTip from "../ui/custom/tooltip";

interface BookCardProps {
  book: Book;
}

export default function BookCard({ book }: BookCardProps) {
  const categoryColor =
    BOOK_CATEGORY_COLORS[book.tag as Category] ||
    "bg-gray-200 text-gray-700 border-gray-300";

  const coverUrl = book.cover_edition_key
    ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg`
    : `/ReadHub_PlaceHolder.png`;

  const archiveUrl = `https://archive.org/details/${book.lending_identifier_s}?view=theater`;
  const openLibraryUrl = `https://openlibrary.org/${book.work_key}`;

  return (
    <Card className="group overflow-hidden flex flex-col hover:-translate-y-1 hover:shadow-xl transition-all duration-300 border-zinc-200 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-600">
      {/* Cover Image */}
      <div className="relative h-52 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <img
          src={coverUrl}
          onError={(e) => {
            e.currentTarget.src = "/ReadHub_PlaceHolder.png";
          }}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
          alt={book.title}
        />
        {/* Gradient overlay */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

        {/* Category badge — overlaid */}
        <div className="absolute top-2.5 left-2.5">
          <Badge
            variant="outline"
            className={`rounded-full px-2.5 h-6 text-[10px] font-bold capitalize shadow-sm ${categoryColor}`}
          >
            {book.tag.slice(0, 14)}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <CardHeader className="px-3 py-2.5 pb-0 flex-grow">
        <CardTitle className="text-sm font-black leading-snug line-clamp-2">
          {book.title}
        </CardTitle>
        <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
          by {book.author_name?.[0] ?? "Unknown Author"}
        </p>
      </CardHeader>

      {/* Footer */}
      <CardFooter className="px-3 py-2.5 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
        <ToolTip content="Read on Internet Archive">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={archiveUrl}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400 hover:underline transition-all"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Read Now
          </Link>
        </ToolTip>

        <ToolTip content="View on OpenLibrary">
          <Link
            target="_blank"
            rel="noopener noreferrer"
            href={openLibraryUrl}
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors group/link"
          >
            Details
            <ExternalLink className="w-3 h-3 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          </Link>
        </ToolTip>
      </CardFooter>
    </Card>
  );
}
