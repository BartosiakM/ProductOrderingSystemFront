import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProductsPage from './pages/ProductsPage';
import CartPage from './pages/CartPage';
import Navbar from './components/Navbar';
import './App.css';
import EditPage from './pages/EditPage';
import OrdersPage from './pages/OrdersPage';
import DbInitPage from './pages/DbInitPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PrivateRoute from './components/PrivateRoute';
import EmployeePage from './pages/EmployeePage';
import ReviewsPage from './pages/ReviewForm';
import ReviewForm from './pages/ReviewForm';

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        {/* Publiczne strony */}
        <Route path="/" element={<ProductsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Strony chronione */}
        <Route
          path="/employee"
          element={
            <PrivateRoute roles={['PRACOWNIK']}>
              <EmployeePage />
            </PrivateRoute>
          }
        />
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
            <PrivateRoute roles={['KLIENT']}>
              <ReviewsPage />
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
    </Router>
  );
};

export default App;
