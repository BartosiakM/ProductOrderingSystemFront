import React, { useState, useEffect } from 'react';
import { Product } from '../types';

interface CartItem extends Product {
  quantity: number;
}

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  // Funkcja pomocnicza do zapisywania danych do localStorage
  const saveCartItems = (items: CartItem[]) => {
    try {
      localStorage.setItem('cartItems', JSON.stringify(items));
    } catch (err) {
      console.error('Błąd podczas zapisywania koszyka:', err);
    }
  };

  // Wczytywanie danych z localStorage przy załadowaniu strony
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

  // Obsługa zmiany ilości produktów
  const handleQuantityChange = (index: number, quantity: number) => {
    const newCartItems = [...cartItems];
    if (quantity > 0) {
      newCartItems[index].quantity = quantity;
      setCartItems(newCartItems);
      saveCartItems(newCartItems);
    }
  };

  // Usuwanie produktu z koszyka
  const handleRemoveItem = (index: number) => {
    const newCartItems = cartItems.filter((_, i) => i !== index);
    setCartItems(newCartItems);
    saveCartItems(newCartItems);
  };

  // Obliczanie łącznej ceny
  const totalPrice = cartItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  // Obsługa formularza zamówienia
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Zamówienie złożone:', {
      username,
      email,
      phone,
      cartItems,
    });
    alert('Zamówienie zostało pomyślnie złożone!');
  };

  return (
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
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="phone" className="form-label">
                Telefon
              </label>
              <input
                type="tel"
                className="form-control"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
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
  );
};

export default CartPage;
