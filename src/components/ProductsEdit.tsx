import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Product } from '../types';
import { generateSeoDescription } from "../utils/api.ts";
import './ProductEdit.css';

const ProductsEdit: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [seoLoading, setSeoLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const productResponse = await api.get('http://localhost:3000/products');
        console.log('Product response:', productResponse.data);
        setProducts(productResponse.data);

        const categoryResponse = await api.get('http://localhost:3000/categories');
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (editedProduct) {
      const { name, value } = e.target;

      setEditedProduct({
        ...editedProduct,
        [name]: ['unitPrice', 'unitWeight', 'categoryId'].includes(name)
          ? parseFloat(value) // Konwersja na liczbę dla odpowiednich pól
          : value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editedProduct) {
      try {
        console.log('Sending data to server:', editedProduct);
        const response = await api.put(
          `http://localhost:3000/products/${editedProduct.id}`,
          editedProduct
        );
        console.log('Response from server:', response.data);

        // Aktualizacja listy produktów
        setProducts(products.map(p => (p.id === editedProduct.id ? response.data : p)));
        setEditedProduct(null);
        setSubmitError(null);
      } catch (error: any) {
        console.error('Error updating product:', error);

        // Obsługa błędów z serwera
        if (error.response && error.response.data) {
          const serverErrorMessage =
            error.response.data.error || // Pobierz `error` z odpowiedzi
            error.response.data.message || // Jeśli dostępne, pobierz `message`
            'Nieznany błąd serwera'; // Domyślny komunikat błędu

          setSubmitError(serverErrorMessage); // Ustaw komunikat błędu z serwera
        } else {
          setSubmitError('Nie udało się zaktualizować produktu. Spróbuj ponownie.');
        }
      }
    }
  };

  const handleGenerateSeoDescription = async () => {
    if (editedProduct) {
      try {
        setSeoLoading(true);
        const seoDescription = await generateSeoDescription(editedProduct.id.toString());
        setEditedProduct({
          ...editedProduct,
          description: seoDescription,
        });
      } catch (error: unknown) {
        console.error('Error generating SEO description:', error);
        setSubmitError('Nie udało się wygenerować opisu SEO. Spróbuj ponownie.');
      } finally {
        setSeoLoading(false);
      }
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
            <button className="btn btn-primary" onClick={() => handleEdit(product)}>
              Edit
            </button>
          </li>
        ))}
      </ul>
      {editedProduct && (
        <div>
          <h2 className="my-4">Edit Product: {editedProduct.name}</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name:</label>
              <input
                type="text"
                id = "edit-name"
                className="form-control"
                name="name"
                value={editedProduct.name}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Description:</label>
              <input
                type="text"
                id = "edit-description"
                className="form-control"
                name="description"
                value={editedProduct.description}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              {seoLoading && <p>Generating SEO description...</p>}
                <button type="button" className="btn btn-secondary " id = "seo" onClick={handleGenerateSeoDescription} disabled={seoLoading}>
                Generate SEO Description
            </button>
            </div>
            <div className="mb-3">
              <label className="form-label">Unit Price:</label>
              <input
                type="number"
                id = "edit-price"
                className="form-control"
                name="unitPrice"
                value={editedProduct.unitPrice}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Unit Weight:</label>
              <input
                type="number"
                id = "edit-weight"
                className="form-control"
                name="unitWeight"
                value={editedProduct.unitWeight}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Category:</label>
              <select
                className="form-select"
                id = "edit-category"
                name="categoryId"
                value={editedProduct.categoryId}
                onChange={handleChange}
              >
                <option value="" disabled>
                  Wybierz kategorię
                </option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-success">Submit</button>
          </form>
          {submitError && <div className="alert alert-danger mt-3">{submitError}</div>}
        </div>
      )}
    </div>
  );
};

export default ProductsEdit;
