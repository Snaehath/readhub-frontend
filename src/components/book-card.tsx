import Link from "next/link"
import { BookOpen} from "lucide-react"

import { Card, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Book } from "@/types"

interface BookCardProps {
  book: Book
}

export default function BookCard({ book }: BookCardProps) {
  return (
    <Card className="overflow-hidden flex flex-col h-96 sm:w-auto hover:shadow-md hover:shadow-gray-500/50 ">
      <div className="relative h-48 w-full">
        <img src={book.cover_edition_key ? `https://covers.openlibrary.org/b/olid/${book.cover_edition_key}-M.jpg` : `https://placehold.co/200x200?text=${book.title}%0ABy%0A${book.author_name[0]}`} alt={book.title} className="object-contain w-full h-full " />
      </div>
      <CardHeader className="pl-3">
        <Badge className="w-fit mb-1 text-xs">{book.tag.slice(0,12)}</Badge>
        <CardTitle className="text-md line-clamp-1">{book.title}</CardTitle>
        <p className="text-xs text-muted-foreground">by {book.author_name[0] ?? "finding"}</p>
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
          
        <BookOpen/>
        </Link>
      </CardFooter>
    </Card>
  )
}