import React from 'react';

const OrderSummary = ({ subtotal, shippingCost, total, showActions = false, onCheckout, onContinueShopping }) => {
  return (
    <div className="order-summary-card">
      <h3>Ringkasan Pesanan</h3>
      <div className="summary-row">
        <span>Subtotal</span>
        <strong>Rp {Number(subtotal).toLocaleString('id-ID')}</strong>
      </div>
      <div className="summary-row">
        <span>Ongkir</span>
        <strong>Rp {Number(shippingCost).toLocaleString('id-ID')}</strong>
      </div>
      <div className="summary-row total">
        <span>Total</span>
        <strong>Rp {Number(total).toLocaleString('id-ID')}</strong>
      </div>
      {showActions && (
        <div className="summary-actions">
          <button className="secondary-btn" onClick={onContinueShopping}>Lanjut Belanja</button>
          <button className="primary-btn" onClick={onCheckout}>Checkout</button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
