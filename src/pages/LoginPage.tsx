import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Import do obsługi linków
import api from '../utils/api';

const LoginPage: React.FC = () => {
  const [email, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      console.log('Response:', response.data);
      const { token } = response.data;

      console.log('Token:', token);
      localStorage.setItem('token', token);

      // Dekodowanie tokena, aby pobrać rolę
      const base64Url = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Url));
      localStorage.setItem('role', decoded.role);
      localStorage.setItem('id', decoded.id);

      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Logowanie nie powiodło się.');
    }
  };

  return (
    <div className="login-page">
    <div className="container mt-5 ">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title text-center mb-4">Logowanie</h1>
              {error && <p className="alert alert-danger text-center">{error}</p>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Nazwa użytkownika:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={email}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Hasło:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary">
                    Zaloguj się
                  </button>
                </div>
              </form>
              <p className="text-center mt-3">
                Nie masz konta?{' '}
                <Link to="/register" className="text-primary">
                  Zarejestruj się
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;
