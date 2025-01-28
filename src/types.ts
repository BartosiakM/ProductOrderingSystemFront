// src/types.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  descriptionHTML: string | null;
  unitPrice: number;
  unitWeight: number;
  categoryId: number;
  imageUrl: string | null;
}

export interface CartItem extends Product {
  quantity: number;
}