import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Import Bootstrap JS // Import Bootstrap CSS
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'; // Możesz dodać własne style tutaj
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import EditPage from './pages/EditPage';
import OrdersPage from './pages/OrdersPage';
import DbInitPage from './pages/DbInitPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute'; // Import `PrivateRoute`
import EmployeePage from './pages/EmployeePage';
import ReviewForm from './pages/ReviewForm';
import ReviewsPage from './pages/ReviewsPage';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* Publiczne strony */}
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Strony chronione */}
        <Route
          path="/review"
          element={
            <PrivateRoute roles={['KLIENT']}>
              <ReviewForm />
            </PrivateRoute>
          }
        />
        <Route
          path="/reviews"
          element={
            <PrivateRoute roles={['KLIENT', 'PRACOWNIK']}>
              <ReviewsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <PrivateRoute roles={['PRACOWNIK']}>
              <EmployeePage />
            </PrivateRoute>
          }
        />
        <Route
          path="/edit"
          element={
            <PrivateRoute roles={['PRACOWNIK']}>
              <EditPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute roles={['PRACOWNIK']}>
              <OrdersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/init"
          element={
            <PrivateRoute roles={['PRACOWNIK']}>
              <DbInitPage />
            </PrivateRoute>
          }
        />


      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
