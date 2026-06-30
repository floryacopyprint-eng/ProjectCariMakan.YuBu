import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';

const CartBadge = () => {
  const { getTotalItems } = useCart();
  const totalItems = getTotalItems();

  return (
    <Link to="/cart" className="btn-login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
      🛒 {totalItems > 0 ? totalItems : 0}
    </Link>
  );
};

export default CartBadge;
