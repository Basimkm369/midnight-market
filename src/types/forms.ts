export type AddFormValues = {
  title: string;
  price: number;
  category: string | undefined;
  description: string | undefined;
  rating: number | undefined;
  image: FileList | undefined;
};

export type EditFormValues = {
  title: string;
  price: number;
  category: string | undefined;
  description: string | undefined;
  rating: number | undefined;
  image: FileList | undefined;
};
