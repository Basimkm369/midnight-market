export type Product = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  images: any;
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
