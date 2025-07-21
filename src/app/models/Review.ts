export interface Review {
  _id?: string;
  userId: string;
  recipeId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}