import React, { useState } from 'react';
import { Product } from '../types';
import './ProductsTable.css';

interface ProductTableProps {
  products: Product[];
  onBuy: (product: Product) => void;
}

const ProductTable: React.FC<ProductTableProps> = ({ products, onBuy }) => {
  const [clickedProduct, setClickedProduct] = useState<number | null>(null);

  const handleBuyClick = (product: Product) => {
    setClickedProduct(product.id);
    onBuy(product);

    // Usuń klasę `clicked` po krótkim czasie
    setTimeout(() => setClickedProduct(null), 300);
  };

  return (
    <div className="product-grid">
      {products.map((product) => (
        <div key={product.id} className="product-card">
          <div className="product-image-wrapper">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            ) : (
              <div className="no-image">Brak zdjęcia</div>
            )}
          </div>
          <div className="product-info">
            <h5 className="product-name">{product.name}</h5>
            <p className="product-description">{product.description}</p>
            <p className="product-price">
              {product.unitPrice ? `${product.unitPrice.toFixed(2)} zł` : 'N/A'}
            </p>
            <button
              className={`btn btn-primary btn-sm ${
                clickedProduct === product.id ? 'clicked' : ''
              }`}
              onClick={() => handleBuyClick(product)}
            >
              Kup
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductTable;
