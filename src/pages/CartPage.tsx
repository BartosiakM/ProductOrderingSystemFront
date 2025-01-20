import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import Navbar from '../components/Navbar';
import api from '../utils/api'; // Import konfiguracji axios

interface CartItem extends Product {
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<{ username?: string; email?: string; phone?: string }>({});

  const saveCartItems = (items: CartItem[]) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (err) {
      console.error('Błąd podczas zapisywania koszyka:', err);
    }
  };

  useEffect(() => {
    try {
      const storedCartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      if (Array.isArray(storedCartItems)) {
        setCartItems(storedCartItems);
      } else {
        console.warn('Nieprawidłowe dane w localStorage, resetowanie koszyka.');
        setCartItems([]);
      }
    } catch (err) {
      console.error('Błąd podczas wczytywania koszyka:', err);
      setCartItems([]);
    }
  }, []);

  const handleQuantityChange = (index: number, quantity: number) => {
    const newCartItems = [...cartItems];
    if (quantity > 0) {
      newCartItems[index].quantity = quantity;
      setCartItems(newCartItems);
      saveCartItems(newCartItems);
    }
  };

  const handleRemoveItem = (index: number) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    saveCartItems(newCartItems);
  };

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Funkcja walidująca dane
  const validateForm = () => {
    const newErrors: { username?: string; email?: string; phone?: string } = {};

    if (!username.trim()) {
      newErrors.username = 'Nazwa użytkownika jest wymagana.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email)) {
      newErrors.email = 'Podaj poprawny adres email.';
    }

    const phoneRegex = /^[0-9]{9}$/;
    if (!phone.trim() || !phoneRegex.test(phone)) {
      newErrors.phone = 'Podaj poprawny numer telefonu (9 cyfr).';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Zatrzymanie wysyłania formularza w przypadku błędów
    }

    const orderBody = {
      statusId: 1,
      customerName: username,
      email: email,
      phoneNumber: phone,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
      })),
    };

    try {
      const response = await api.post('/orders', orderBody); // Wysyłanie zamówienia przez axios
      if (response.status === 201 || response.status === 200) {
        alert('Zamówienie zostało pomyślnie złożone!');
        setCartItems([]); // Wyczyść koszyk
        saveCartItems([]); // Usuń dane koszyka z localStorage
        setUsername(''); // Resetuj formularz
        setEmail('');
        setPhone('');
        setErrors({}); // Wyczyszczenie błędów
      } else {
        throw new Error('Nie udało się złożyć zamówienia');
      }
    } catch (error) {
      console.error('Błąd podczas składania zamówienia:', error);
      alert('Wystąpił problem podczas składania zamówienia. Spróbuj ponownie.');
    }
  };

  return (
    <div className="container-fluid main-content">
      <Navbar />
      <div className="container mt-4">
        <h1>Koszyk</h1>
        {cartItems.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>Nazwa</th>
                  <th>Ilość</th>
                  <th>Cena</th>
                  <th>Akcje</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, parseInt(e.target.value, 10))
                        }
                        min="1"
                      />
                    </td>
                    <td>{(item.unitPrice * item.quantity).toFixed(2)} zł</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveItem(index)}
                      >
                        Usuń
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="mt-4">
              <h2>Łączna cena: {totalPrice.toFixed(2)} zł</h2>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Nazwa użytkownika
                </label>
                <input
                  type="text"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  Telefon
                </label>
                <input
                  type="tel"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>
              <button type="submit" className="btn btn-primary">
                Zatwierdź zamówienie
              </button>
            </form>
          </>
        ) : (
          <h2>Koszyk jest pusty</h2>
        )}
      </div>
    </div>
  );
};

export default CartPage;
