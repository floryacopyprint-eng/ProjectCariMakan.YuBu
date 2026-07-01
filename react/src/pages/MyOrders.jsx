import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Loading from '../components/Loading';
import { getOrdersByUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import '../pages/Favorites.css';

const getStatusLabel = (status) => {
  switch (status) {
    case 'pending':
    case 'Menunggu Verifikasi Pembayaran':
      return 'Menunggu Verifikasi Pembayaran';
    case 'diproses':
    case 'Diproses':
      return 'Diproses';
    case 'dikirim':
    case 'Dikirim':
      return 'Dikirim';
    case 'selesai':
    case 'Selesai':
      return 'Selesai';
    case 'dibatalkan':
    case 'Dibatalkan':
      return 'Dibatalkan';
    default:
      return status || '-';
  }
};

const MyOrders = () => {
  const location = useLocation();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadOrders = async () => {
      try {
        setLoading(true);

        const currentUserId = user?.user_id || user?.id;
        if (!currentUserId) {
          if (isMounted) {
            setOrders([]);
          }
          return;
        }

        const response = await getOrdersByUser(currentUserId);
        const payload = Array.isArray(response?.data?.data) ? response.data.data : [];
        if (isMounted) {
          setOrders(payload);
        }
      } catch (error) {
        console.error('Error loading orders:', error);
        if (isMounted) {
          setOrders([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (!authLoading) {
      loadOrders();
    }

    return () => {
      isMounted = false;
    };
  }, [authLoading, user?.user_id, user?.id]);

  if (authLoading || loading) {
    return <Loading message="Memuat riwayat pesanan..." />;
  }

  return (
    <main className="favorites-page">
      <div className="container" style={{ padding: '2rem 1rem' }}>
        <h1>📦 Riwayat Pesanan Saya</h1>
        {location.state?.success && <p className="success-message">Pesanan berhasil dibuat. Silakan tunggu verifikasi pembayaran.</p>}
        {orders.length === 0 ? (
          <div className="empty-state">
            <p>Belum ada riwayat pesanan.</p>
            <Link to="/" className="primary-btn">Mulai Belanja</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const safeOrder = order || {};
              const orderId = safeOrder.id || safeOrder.order_id || 'unknown';
              const orderItems = Array.isArray(safeOrder.items) ? safeOrder.items : [];
              const hasTextItems = typeof safeOrder.items === 'string' && safeOrder.items.trim();

              return (
                <div key={orderId} className="order-card">
                  <div className="order-header">
                    <div>
                      <h3>Nomor Order #{orderId}</h3>
                      <p>{safeOrder.created_at ? new Date(safeOrder.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }) : 'Baru dibuat'}</p>
                    </div>
                    <span className="status-badge">{getStatusLabel(safeOrder.status)}</span>
                  </div>
                  <div className="order-body">
                    <p><strong>Total:</strong> Rp {Number(safeOrder.total_price || safeOrder.total_harga || 0).toLocaleString('id-ID')}</p>
                    <p><strong>Metode Pembayaran:</strong> {safeOrder.paymentMethod || '-'}</p>
                    <p><strong>Alamat:</strong> {safeOrder.address || safeOrder.alamat_pengiriman || '-'}</p>
                    <div>
                      <strong>Daftar Produk:</strong>
                      <ul>
                        {orderItems.length > 0 ? orderItems.map((item, index) => (
                          <li key={`${orderId}-${index}`}>
                            {item.productName || item.product_name || item.name} × {item.quantity} — Rp {Number(item.subtotal || item.price * item.quantity || 0).toLocaleString('id-ID')}
                          </li>
                        )) : hasTextItems ? <li>{safeOrder.items}</li> : <li>Belum ada item</li>}
                      </ul>
                    </div>
                    <div style={{ marginTop: '12px' }}>
                      <Link
                        to={`/order-receipt/${orderId}`}
                        style={{
                          display: 'inline-block',
                          background: '#667eea',
                          color: 'white',
                          padding: '8px 18px',
                          borderRadius: '8px',
                          textDecoration: 'none',
                          fontSize: '0.88rem',
                          fontWeight: '600'
                        }}
                      >
                        🖨️ Cetak Bukti Pembayaran
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyOrders;
