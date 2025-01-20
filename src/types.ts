// src/types.ts
export interface Product {
  id: number;
  name: string;
  description: string;
  descriptionHTML: string | null;
  unitPrice: number;
  unitWeight: number;
  categoryId: number;
}

export interface CartItem extends Product {
  quantity: number;
}