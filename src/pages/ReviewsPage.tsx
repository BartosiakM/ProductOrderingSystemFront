import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';

interface Review {
  id: number;
  orderId: number;
  rating: number;
  text: string;
  createdAt: string;
}

const ReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await api.get('/orders/opinions');
        setReviews(response.data);
      } catch (err: any) {
        setError('Nie udało się pobrać opinii z serwera');
        console.error('Szczegóły błędu:', err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="container-fluid main-content">
      <Navbar />
      <div className="container mt-4">
        <h1>Opinie</h1>
        {loading && <p>Ładowanie opinii...</p>}
        {error && <p className="text-danger">{error}</p>}

        <table className="table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>ID Zamówienia</th>
              <th>Ocena</th>
              <th>Treść Opinii</th>
              <th>Data Utworzenia</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.id}</td>
                <td>{review.orderId}</td>
                <td>{review.rating}</td>
                <td>{review.text}</td>
                <td>{formatDate(review.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReviewsPage;
