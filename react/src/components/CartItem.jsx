import React from 'react';

const CartItem = ({ item, onIncrease, onDecrease, onRemove }) => {
  const defaultImage = 'https://via.placeholder.com/120x90?text=' + encodeURIComponent(item.productName);

  return (
    <div className="cart-item-card">
      <img src={item.image || defaultImage} alt={item.productName} />
      <div className="cart-item-info">
        <h3>{item.productName}</h3>
        <p>Rp {Number(item.price).toLocaleString('id-ID')}</p>
        <div className="cart-qty-row">
          <button onClick={() => onDecrease(item.productId)}>-</button>
          <span>{item.quantity}</span>
          <button onClick={() => onIncrease(item.productId)}>+</button>
        </div>
      </div>
      <div className="cart-item-actions">
        <p>Subtotal: Rp {Number(item.subtotal).toLocaleString('id-ID')}</p>
        <button className="remove-btn" onClick={() => onRemove(item.productId)}>
          Hapus
        </button>
      </div>
    </div>
  );
};

export default CartItem;
