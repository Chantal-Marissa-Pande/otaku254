export type PostCategory = "Anime" | "Manga" | "K-pop" | "Merch";

export interface Post {
  id: string;
  title: string;
  category: PostCategory;
  description: string;
  content: string;
  image?: string;
  author: string;
  createdAt: number;
  tags: string[];
  featured?: boolean;
  readTime?: string;
}
