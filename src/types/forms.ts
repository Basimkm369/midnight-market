export type AddFormValues = {
  title: string;
  price: number;
  category?: string;
  description?: string;
  rating?: number;
  image?: FileList;
};

export type EditFormValues = {
  title: string;
  price: number;
  category?: string;
  description?: string;
  rating?: number;
  image?: FileList;
};
