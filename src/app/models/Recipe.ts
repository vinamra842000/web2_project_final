export interface Recipe {
  _id?: string;
  title: string;
  description: string;
  ingredients: string[];
  steps: string[];
  userId: string;
  image?: string;
  catogory: string;
  createdAt?: Date;
}