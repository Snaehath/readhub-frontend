import { Metadata } from "next";
import LibraryView from "@/components/books/library-view";

export const metadata: Metadata = {
  title: "E-Book Archive",
  description:
    "Browse an expansive library of digital books across every genre.",
};

const LibraryPage = () => {
  return <LibraryView />;
};

export default LibraryPage;
