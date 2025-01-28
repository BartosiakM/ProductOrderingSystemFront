import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar'; // Dodaj nawigację
import './EmployeePage.css'; // Dodaj stylowanie

const EmployeePage: React.FC = () => {
  return (
    <div className="container-fluid main-content">
      <Navbar />
      <div className="container mt-4">
        <h1 className="mb-4 text-center">Panel Pracownika</h1>
        <div className="row g-4">
          <div className="col-md-6 col-lg-3">
            <Link to="/edit" className="employee-tile">
              <div className="tile-content text-center">
                <h2>Edycja produktów</h2>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-3">
            <Link to="/orders" className="employee-tile">
              <div className="tile-content text-center">
                <h2>Zamówienia</h2>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-3">
            <Link to="/init" className="employee-tile">
              <div className="tile-content text-center">
                <h2>Inicjalizacja bazy danych</h2>
              </div>
            </Link>
          </div>
          <div className="col-md-6 col-lg-3">
            <Link to="/reviews" className="employee-tile">
              <div className="tile-content text-center">
                <h2>Opinie</h2>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
