import React, { useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/api';
import Loading from '../components/Loading';
import OrderSummary from '../components/OrderSummary';
import '../pages/Favorites.css';

const paymentMethods = {
  bank: { label: 'Transfer Bank', account: 'BCA', number: '1234567890', owner: 'a.n Toko Demo' },
  ewallet: { label: 'E-Wallet', account: 'OVO', number: '081234567890', owner: '' },
  cod: { label: 'COD', account: 'Pembayaran dilakukan saat barang diterima.', number: '', owner: '' }
};

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart, getTotalPrice, getTotalItems } = useCart();
  const { user } = useAuth();
  const currentUserId = user?.user_id || user?.id || null;
  const [form, setForm] = useState({
    customer: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const shippingCost = 15000;
  const subtotal = useMemo(() => getTotalPrice(), [cart, getTotalPrice]);
  const total = subtotal + shippingCost;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!cart.length) {
      nextErrors.cart = 'Keranjang masih kosong.';
    }
    if (!form.customer.trim()) nextErrors.customer = 'Nama wajib diisi.';
    if (!form.phone.trim()) nextErrors.phone = 'Nomor HP wajib diisi.';
    if (!form.address.trim()) nextErrors.address = 'Alamat lengkap wajib diisi.';
    if (!form.paymentMethod) nextErrors.paymentMethod = 'Metode pembayaran wajib dipilih.';
    return nextErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    if (!currentUserId) {
      setErrors({ submit: 'Silakan login terlebih dahulu sebelum checkout.' });
      navigate('/login');
      return;
    }

    try {
      setSubmitting(true);
      await createOrder({
        user_id: currentUserId,
        customer: form.customer.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
        notes: form.notes.trim(),
        paymentMethod: form.paymentMethod,
        subtotal,
        shippingCost,
        total,
        status: 'Menunggu Verifikasi Pembayaran',
        items: cart.map((item) => ({
          productId: item.productId,
          productName: item.productName,
          price: item.price,
          quantity: item.quantity,
          subtotal: item.subtotal
        }))
      });

      clearCart();
      navigate('/my-orders', { state: { success: true } });
    } catch (error) {
      setErrors({ submit: error.response?.data?.message || 'Gagal membuat pesanan. Silakan coba lagi.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!cart.length) {
    return (
      <main className="favorites-page">
        <div className="container" style={{ padding: '2rem 1rem' }}>
          <div className="empty-state">
            <p>Checkout tidak dapat dilakukan karena keranjang kosong.</p>
            <Link to="/" className="primary-btn">Lanjut Belanja</Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="favorites-page">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h1>🧾 Checkout</h1>
        {submitting && <Loading message="Memproses checkout..." />}
        <div className="cart-layout">
          <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Data Pemesan</h3>
            {errors.cart && <p className="error-message">{errors.cart}</p>}
            {errors.submit && <p className="error-message">{errors.submit}</p>}

            <label>Nama
              <input name="customer" value={form.customer} onChange={handleChange} placeholder="Nama lengkap" />
              {errors.customer && <span className="error-message">{errors.customer}</span>}
            </label>

            <label>Nomor HP
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="08xxxxxxxxxx" />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </label>

            <label>Alamat Lengkap
              <textarea name="address" rows="3" value={form.address} onChange={handleChange} placeholder="Alamat lengkap" />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </label>

            <label>Catatan
              <textarea name="notes" rows="2" value={form.notes} onChange={handleChange} placeholder="Opsional" />
            </label>

            <label>Metode Pembayaran
              <select name="paymentMethod" value={form.paymentMethod} onChange={handleChange}>
                <option value="">Pilih metode pembayaran</option>
                <option value="bank">Transfer Bank</option>
                <option value="ewallet">E-Wallet</option>
                <option value="cod">COD</option>
              </select>
              {errors.paymentMethod && <span className="error-message">{errors.paymentMethod}</span>}
            </label>

            {form.paymentMethod && (
              <div className="payment-detail">
                <h4>{paymentMethods[form.paymentMethod].label}</h4>
                <p><strong>{paymentMethods[form.paymentMethod].account}</strong></p>
                <p>{paymentMethods[form.paymentMethod].number}</p>
                <p>{paymentMethods[form.paymentMethod].owner}</p>
              </div>
            )}

            <button className="primary-btn" type="submit" disabled={submitting}>
              {submitting ? 'Memproses...' : 'Saya Sudah Membayar'}
            </button>
          </form>

          <div className="cart-summary">
            <h3>Ringkasan Pesanan</h3>
            <p>{getTotalItems()} item</p>
            <OrderSummary subtotal={subtotal} shippingCost={shippingCost} total={total} />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Checkout;
