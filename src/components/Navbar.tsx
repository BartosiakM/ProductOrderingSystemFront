import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.jpg'; // Import logo
import './Navbar.css';

const Navbar: React.FC = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light">
      <div className="container-fluid">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="Logo" width="30" height="30" />
          Online Shop
        </Link>
        <Link to="/edit" className="btn">
          Edycja produktów
        </Link>
        <Link to="/orders" className="btn orderbtn">
          Zamówienia
        </Link>
        <Link to="/init" className="btn orderbtn">
          Inicjalizacja bazy danych
        </Link>
        <Link to="/cart" className="btn btn-outline-success">
          Koszyk
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
