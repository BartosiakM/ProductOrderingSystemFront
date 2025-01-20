import React from 'react';
import { Product } from '../types';

interface ProductTableProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onBuy }) => {
  return (
    <div className="table-responsive">
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Nazwa</th>
            <th>Opis</th>
            <th>Cena</th>
            <th>Akcje</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>{product.unitPrice ? product.unitPrice.toFixed(2) : 'N/A'}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onBuy(product)}
                >
                  Kup
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
