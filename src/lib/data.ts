"use server";

import client from "../lib/mongodb";

//get news data from database country:us
export async function getNews() {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db();
    const newsCollection = db.collection("news");

    const news = await newsCollection
      .find({})
      .sort({ publishedAt: -1 })
      .toArray();

    const formattedNews = news.map((article) => {
      return {
        id: article._id.toString(),
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.urlToImage,
        publishedAt: new Date(article.publishedAt).toLocaleString(),
        dateOriginal:article.publishedAt,
        source: article.source,
        category: article.category,
      };
    });

    return formattedNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

//get news data from databse country:india
export async function getNewsIndia() {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db();
    const newsCollection = db.collection("newsins");

    const news = await newsCollection
      .find({})
      .sort({ publishedAt: -1 })
      .toArray();

    const formattedNews = news.map((article) => ({
      id: article._id.toString(),
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      urlToImage: article.urlToImage,
      publishedAt:new Date(article.publishedAt).toLocaleString(),
      dateOriginal:article.publishedAt,
      source: article.source,
      category: article.category,
    }));

    return formattedNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
}

export async function getFeaturedBooks() {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db();
    const booksCollection = db.collection("books");

    const books = await booksCollection.find({}).limit(4).toArray();

    const formattedBooks = books.map((book) => ({
      _id: book._id.toString(),
      title: book.title,
      summaries: book.summaries,
      url: book.readUrl,
      urlToImage: book.coverImage,
      category: book.category,
      author: {
        ...book.authors[0],
        _id: book.authors[0]?._id?.toString?.() ?? undefined,
      },
    }));

    return formattedBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
export async function getBooks() {
  try {
    const mongoClient = await client.connect();
    const db = mongoClient.db();
    const booksCollection = db.collection("books");

    const books = await booksCollection.find({}).toArray();

    const formattedBooks = books.map((book) => ({
      _id: book._id.toString(),
      title: book.title,
      summaries: book.summaries,
      url: book.readUrl,
      urlToImage: book.coverImage,
      category: book.category,
      author: {
        ...book.authors[0],
        _id: book.authors[0]?._id?.toString?.() ?? undefined,
      },
    }));

    return formattedBooks;
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}
