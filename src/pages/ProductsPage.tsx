import React, { useState, useEffect } from 'react';
import ProductTable from '../components/ProductsTable';
import FilterBar from '../components/FilterBar';
import Navbar from '../components/Navbar'; // Import Navbar
import { Product, CartItem } from '../types';
import api from '../utils/api';


interface Category {
  id: number;
  name: string;
}

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const productResponse = await api.get('/products');
        console.log('Product response:', productResponse.data); // Logowanie odpowiedzi API
        setProducts(productResponse.data);
  
        const categoryResponse = await api.get('/categories');
        console.log('Category response:', categoryResponse.data); // Logowanie odpowiedzi API
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
  

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchesName = product.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category ? product.categoryId === category : true;
      return matchesName && matchesCategory;
    });
    setFilteredProducts(filtered);
  }, [search, category, products]);

  const handleCategoryChange = (value: string) => {
    setCategory(value === '' ? '' : parseInt(value));
  };

  const handleBuy = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItemIndex = cartItems.findIndex((item: CartItem) => item.id === product.id);

    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += 1;
    } else {
      cartItems.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log('Dodano do koszyka:', product);
  };

  if (loading) return <div>Ładowanie danych...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container-fluid main-content">
      <Navbar /> {/* Dodaj Navbar */}
      <div className="container mt-4">
        <h1>Lista produktów</h1>
        <FilterBar
          search={search}
          category={category === '' ? '' : category.toString()}
          categories={categories}
          onSearchChange={setSearch}
          onCategoryChange={handleCategoryChange}
        />
        <ProductTable products={filteredProducts} onBuy={handleBuy} />
      </div>
    </div>
  );
};

export default ProductsPage;