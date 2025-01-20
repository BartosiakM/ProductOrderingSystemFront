import React from 'react';
import Navbar from '../components/Navbar';
import ProductEdit from '../components/ProductsEdit';

const EditPage: React.FC = () => {
  return (
    <div className="container-fluid main-content">
      <Navbar /> 
      <div className="container mt-4">
      <ProductEdit />
      </div>
    </div>
  );
};

export default EditPage;