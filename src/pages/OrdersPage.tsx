import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import api from '../utils/api';
import './OrderPage.css';

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

interface Status {
  id: number;
  name: string;
}

const OrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statuses, setStatuses] = useState<Status[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        const ordersResponse = await api.get('http://localhost:3000/orders');
        setOrders(ordersResponse.data);

        const statusesResponse = await api.get('http://localhost:3000/status');
        setStatuses(statusesResponse.data);
      } catch (err: any) {
        setError('Nie udało się pobrać danych z serwera');
        console.error('Szczegóły błędu:', err.response || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const statusId = parseInt(e.target.value, 10);
    setSelectedStatus(statusId);
  };

  const handleOrderStatusChange = async (orderId: number, newStatusId: number) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;

      const approvalDate =
        newStatusId === 2
          ? order.approvalDate || new Date().toISOString() // Ustaw datę tylko, jeśli status to "approved" i nie istnieje jeszcze
          : order.approvalDate; // Zatrzymaj istniejącą datę dla innych statusów

      const response = await api.patch(`http://localhost:3000/orders/${orderId}`, {
        statusId: newStatusId,
        approvalDate,
      });

      console.log('Response from server:', response.data);

      setOrders(
        orders.map((o) =>
          o.id === orderId
            ? {
                ...o,
                statusId: newStatusId,
                status: statuses.find((status) => status.id === newStatusId) || o.status,
                approvalDate,
              }
            : o
        )
      );
    } catch (err) {
      console.error('Błąd podczas aktualizacji statusu zamówienia:', err);
      alert('Nie udało się zaktualizować statusu zamówienia.');
    }
  };

  const filteredOrders = selectedStatus
    ? orders.filter((order) => order.statusId === selectedStatus)
    : orders;

  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Brak';
    const date = new Date(dateString);
    return date.toLocaleDateString(); // Formatuje datę w stylu lokalnym, np. "20.01.2025"
  };

  return (
    <div className="container-fluid main-content">
      <Navbar />
      <div className="container mt-4">
        <h1>Zamówienia</h1>
        {loading && <p>Loading...</p>}
        {error && <p className="text-danger">{error}</p>}
        <div className="mb-3">
          <label htmlFor="statusFilter" className="form-label">Filtruj po statusie:</label>
          <select
            id="statusFilter"
            className="form-select"
            onChange={handleStatusChange}
            value={selectedStatus || ''}
          >
            <option value="">Wszystkie</option>
            {statuses.map((status) => (
              <option key={status.id} value={status.id}>
                {status.name}
              </option>
            ))}
          </select>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{formatDate(order.approvalDate)}</td>
                <td>
                  <select
                    className="form-select"
                    id ="status"
                    value={order.statusId}
                    onChange={(e) =>
                      handleOrderStatusChange(order.id, parseInt(e.target.value, 10))
                    }
                  >
                    {statuses.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.name}
                      </option>
                    ))}
                  </select>
                </td>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersPage;
