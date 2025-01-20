// src/main.tsx
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; // Możesz dodać własne style tutaj
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProductsPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
