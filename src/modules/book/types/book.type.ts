export type ReviewResponse = {
  id: number;
  text: string;
  rating: number;
  createdAt: Date;
  user?: {
    id: number;
    email: string;
  };
};

export type BookResponse = {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  publishedYear: number;
  genre: string;
  language: string;
  stockCount: number;
  rating: number;
  price: number;
  reviews?: ReviewResponse[];
};

export type GetBooksResponse = {
  content: BookResponse[];
  total: number;
};
