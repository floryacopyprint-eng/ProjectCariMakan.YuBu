import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';
import '../pages/Favorites.css';

const Cart = () => {
  const navigate = useNavigate();
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const shippingCost = 15000;
  const subtotal = getTotalPrice();
  const total = subtotal + shippingCost;

  const handleIncrease = (productId) => {
    const item = cart.find((entry) => entry.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecrease = (productId) => {
    const item = cart.find((entry) => entry.productId === productId);
    if (item) {
      updateQuantity(productId, item.quantity - 1);
    }
  };

  const handleRemove = (productId) => {
    if (window.confirm('Hapus produk dari keranjang?')) {
      removeFromCart(productId);
    }
  };

  return (
    <main className="favorites-page">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <div className="section-header">
          <h1>🛒 Keranjang Saya</h1>
          {cart.length > 0 && (
            <button className="secondary-btn" onClick={() => clearCart()}>
              Kosongkan Keranjang
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="empty-state">
            <p>Keranjang masih kosong.</p>
            <Link to="/" className="primary-btn">Lanjut Belanja</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items-list">
              {cart.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  onRemove={handleRemove}
                />
              ))}
            </div>
            <div className="cart-summary">
              <OrderSummary
                subtotal={subtotal}
                shippingCost={shippingCost}
                total={total}
                showActions
                onContinueShopping={() => navigate('/')}
                onCheckout={() => navigate('/checkout')}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default Cart;
