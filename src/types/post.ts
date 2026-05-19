export interface Post {
  id: string;
  title: string;
  category: "Anime" | "Manga" | "K-pop" | "Merch";
  description: string;
  content: string;
  image?: string;
  author: string;
  createdAt: Date;
  tags: string[];
  featured?: boolean;
  readTime?: string;
}