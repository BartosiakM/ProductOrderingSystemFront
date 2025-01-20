import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Product } from '../types';

const ProductsEdit: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productResponse = await axios.get('http://localhost:3000/products');
        console.log('Product response:', productResponse.data);
        setProducts(productResponse.data);

        const categoryResponse = await axios.get('http://localhost:3000/categories');
        console.log('Category response:', categoryResponse.data);
        setCategories(categoryResponse.data);
      } catch (err: any) {
        setError('Nie udało się pobrać danych z serwera');
        console.error('Szczegóły błędu:', err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEdit = (product: Product) => {
    setEditedProduct(product);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editedProduct) {
      setEditedProduct({
        ...editedProduct,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      axios.put(`http://localhost:3000/products/${editedProduct.id}`, editedProduct)
        .then(response => {
          setProducts(products.map(p => p.id === editedProduct.id ? editedProduct : p));
          setEditedProduct(null);
        })
        .catch(error => console.error('Error updating product:', error));
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Edit Products</h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-danger">{error}</p>}
      <ul className="list-group mb-4">
        {products.map(product => (
          <li key={product.id} className="list-group-item d-flex justify-content-between align-items-center">
            {product.name} - {product.unitPrice} - {product.unitWeight}
            <button className="btn btn-primary" onClick={() => handleEdit(product)}>Edit</button>
          </li>
        ))}
      </ul>
      {editedProduct && (
        <div>
          <h2 className="my-4">Edit Product: {editedProduct.name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input type="text" className="form-control" name="name" value={editedProduct.name} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <input type="text" className="form-control" name="description" value={editedProduct.description} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Unit Price:</label>
              <input type="number" className="form-control" name="unitPrice" value={editedProduct.unitPrice} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Unit Weight:</label>
              <input type="number" className="form-control" name="unitWeight" value={editedProduct.unitWeight} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label">Category ID:</label>
              <input type="number" className="form-control" name="categoryId" value={editedProduct.categoryId} onChange={handleChange} />
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ProductsEdit;