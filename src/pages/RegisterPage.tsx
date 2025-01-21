import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate(); // Hook do nawigacji

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await api.post('/register', { email, password });
      setMessage('Rejestracja zakończona sukcesem! Możesz się teraz zalogować.');
      setEmail('');
      setPassword('');
      
      // Przekierowanie do strony logowania po kilku sekundach
      setTimeout(() => navigate('/login'), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Rejestracja nie powiodła się.');
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Rejestracja</h1>
              {message && (
                <p className="alert alert-success text-center">{message}</p>
              )}
              {error && (
                <p className="alert alert-danger text-center">{error}</p>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Hasło:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Zarejestruj się
                  </button>
                </div>
              </form>
              <p className="text-center mt-3">
                Masz już konto?{' '}
                <Link to="/login" className="text-primary">
                  Zaloguj się
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
