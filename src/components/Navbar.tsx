import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.svg';
import cartIcon from '../assets/shopping-cart.svg';
import './Navbar.css';
import { CartItem } from '../types';
import { motion } from 'framer-motion';

const Navbar: React.FC = () => {
  const token = localStorage.getItem('token'); // Sprawdzamy, czy token jest zapisany
  const userRole = localStorage.getItem('role'); // Pobierz rolę użytkownika
  const [cartCount, setCartCount] = useState<number>(0); // Liczba produktów w koszyku
  const [cartItems, setCartItems] = useState<CartItem[]>([]); // Szczegóły produktów w koszyku
  const [showCartPreview, setShowCartPreview] = useState<boolean>(false); // Czy podgląd koszyka jest widoczny

  const handleLogout = () => {
    localStorage.removeItem('token'); // Usuń token
    localStorage.removeItem('role'); // Usuń rolę
    localStorage.removeItem('email');
    window.location.href = '/login'; // Przekieruj na stronę logowania
  };

  const updateCart = () => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    setCartItems(storedCartItems);
    setCartCount(storedCartItems.reduce((count: number, item: CartItem) => count + item.quantity, 0)); // Zsumuj ilość produktów
  };

  useEffect(() => {
    updateCart();
    window.addEventListener('storage', updateCart);
    return () => {
      window.removeEventListener('storage', updateCart);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg ">
      <div className="container-fluid">
        {/* Logo */}
        <Link to="/" className="navbar-brand d-flex align-items-center">
          <img src={logo} alt="Logo" width="50" height="50" className="me-2" />
          <span>Online Shop</span>
        </Link>

        {/* Hamburger Menu */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          aria-controls="navbarContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Content */}
        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {userRole === 'PRACOWNIK' && (
              <li className="nav-item">
                <Link to="/employee" className="nav-link">
                  Panel Pracownika
                </Link>
              </li>
            )}
          </ul>

          {/* Koszyk */}
          <div
            className="d-flex align-items-center position-relative"
            onMouseEnter={() => setShowCartPreview(true)}
            onMouseLeave={() => setShowCartPreview(false)}
          >
            <Link to="/cart" className="btn btn-outline-success d-flex  align-items-center me-2">
              <img src={cartIcon} alt="Koszyk" width="24" height="24" className="me-1" />
              <motion.span
                key={cartCount}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1.2, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, damping: 10 }}
              >
                {cartCount}
              </motion.span>
            </Link>

            {/* Podgląd koszyka */}
            {showCartPreview && (
              <div className="cart-preview position-absolute p-3 shadow" style={{ top: '100%', right: 0, zIndex: 10 }}>
                {cartItems.length > 0 ? (
                  <ul className="list-unstyled mb-0">
                    {cartItems.map((item, index) => (
                      <li key={index} className="mb-2">
                        <strong>{item.name}</strong> &nbsp; x {item.quantity}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mb-0">Koszyk jest pusty</p>
                )}
              </div>
            )}
          </div>

          {/* Profil użytkownika / Logowanie */}
          {token && userRole === 'KLIENT' ? (
            <div className="dropdown">
              <button
                className="btn btn-primary dropdown-toggle"
                type="button"
                id="profileMenu"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Profil
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="profileMenu">
                <li>
                  <Link to="/review" id = "reviw" className="dropdown-item">
                    Moje zamówienia
                  </Link>
                </li>
                <li>
                  <button className="dropdown-item"  id = "logout" onClick={handleLogout}>
                    Wyloguj
                  </button>
                </li>
              </ul>
            </div>
          ) : token ? (
            <button onClick={handleLogout} className="btn btn-danger">
              Wyloguj
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary">
              Zaloguj
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
