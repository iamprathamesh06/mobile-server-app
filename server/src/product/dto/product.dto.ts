export interface Product {
  _id?: string;
  name: string;
  description?: string;
  createdDate?: Date;
  updatedDate?: Date;
  price?: number;
  // quantity?: number;
  ingredients: Ingredient[];
  storeOwnerId?: string;
}

interface Ingredient {
  grain_id: string;
  proportion: number;
}
