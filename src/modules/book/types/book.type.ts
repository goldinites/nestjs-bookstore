export type BookResponse = {
  id: number;
  title: string;
  imageUrl: string;
  author: string;
  publishedYear: number;
  language: string;
  stockCount: number;
  rating: number;
  price: number;
  genre: string;
};

export type GetBooksResponse = {
  content: BookResponse[];
  total: number;
};
