export type Product = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  brand: string;
  category: string;
  rating: number;
  description: string;
  isLocal?: boolean;
};
