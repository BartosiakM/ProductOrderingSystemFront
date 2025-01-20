// src/types.ts
export interface Product {
    id: number;
    name: string;
    description: string;
    unitPrice: number;
    categoryId: number;
  }

  export interface CartItem extends Product {
    quantity: number;
  }
  