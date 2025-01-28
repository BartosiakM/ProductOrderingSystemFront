import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import './ReviewForm.css';

interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  unitPrice: number;
  quantity: number;
}

interface Order {
  id: number;
  approvalDate: string | null;
  statusId: number;
  customerName: string;
  email: string;
  phoneNumber: string;
  status: {
    id: number;
    name: string;
  };
  orderItems: OrderItem[];
}

interface Review {
  id: number;
  orderId: number;
  rating: number;
  text: string;
  createdAt: string;
}

const ReviewPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState<number>(1);
  const [reviewText, setReviewText] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const id = localStorage.getItem('id'); // Pobranie id z localStorage
        if (!id) {
          throw new Error('Brak id klienta');
        }

        const ordersResponse = await api.get(`/orders/${id}`);
        setOrders(ordersResponse.data);

        const reviewsResponse = await api.get('http://localhost:3000/orders/opinions');
        setReviews(reviewsResponse.data);
      } catch (err: any) {
        setError('Nie udało się pobrać danych z serwera');
        console.error('Szczegóły błędu:', err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleAddOpinionClick = (order: Order) => {
    if (order.status.name !== 'COMPLETED' && order.status.name !== 'CANCELED') {
      alert('Opinie można dodać tylko do zamówień zakończonych lub anulowanych.');
      return;
    }

    const existingReview = reviews.find((review) => review.orderId === order.id);
    if (existingReview) {
      alert('Opinia dla tego zamówienia już istnieje.');
      return;
    }

    setSelectedOrder(order);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedOrder) return;

    try {
      const response = await api.post(`/orders/${selectedOrder.id}/opinions`, {
        rating,
        text: reviewText,
      });

      alert('Opinia została dodana!');
      setSelectedOrder(null); // Ukryj formularz
      setRating(1);
      setReviewText('');
      navigate('/reviews'); // Użyj navigate, aby przejść na stronę ReviewsPage
    } catch (err: any) {
      console.error('Błąd podczas dodawania opinii:', err);
      alert('Nie udało się dodać opinii. Spróbuj ponownie.');
    }
  };

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Brak';
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container-fluid main-content">
      <Navbar />
      <div className="container mt-4">
        <h1>Opinie</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}

        <table className="table-dark">
          <thead>
            <tr>
              <th>ID</th>
              <th>Data zatwierdzenia</th>
              <th>Status</th>
              <th>Klient</th>
              <th>Email</th>
              <th>Telefon</th>
              <th>Produkty</th>
              <th>Akcje</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatDate(order.approvalDate)}</td>
                <td>{order.status.name}</td>
                <td>{order.customerName}</td>
                <td>{order.email}</td>
                <td>{order.phoneNumber}</td>
                <td>
                  <ul>
                    {order.orderItems.map((item) => (
                      <li key={item.id}>
                        Produkt ID: {item.productId}, Ilość: {item.quantity}, Cena: {item.unitPrice} zł
                      </li>
                    ))}
                  </ul>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAddOpinionClick(order)}
                  >
                    Dodaj opinię
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedOrder && (
          <div className="mt-4">
            <h2>Dodaj opinię dla zamówienia #{selectedOrder.id}</h2>
            <form onSubmit={handleSubmitReview}>
              <div className="mb-3">
                <label htmlFor="rating" className="form-label">Ocena (1-5):</label>
                <input
                  type="number"
                  id="rating"
                  className="form-control"
                  value={rating}
                  onChange={(e) => setRating(parseInt(e.target.value, 10))}
                  min="1"
                  max="5"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="reviewText"  className="form-label">Treść opinii:</label>
                <textarea
                  id="reviewText"
                  className="form-control"
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-success">Zatwierdź</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;