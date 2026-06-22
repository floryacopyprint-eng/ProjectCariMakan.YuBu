import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Loading from '../components/Loading';
import { getOrdersByUser } from '../services/api';
import './Orders.css';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = 1; // Hardcoded untuk demo

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending':
      case 'diproses':
        return '⏳ Menunggu';
      case 'confirmed':
      case 'dikirim':
        return '✅ Dikonfirmasi';
      case 'completed':
      case 'selesai':
        return '🎉 Selesai';
      case 'cancelled':
      case 'dibatalkan':
        return '❌ Dibatalkan';
      default:
        return '📦 ' + status;
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await getOrdersByUser(userId);
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      alert('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Header />
        <Loading message="Memuat pesanan..." />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="orders">
        <div className="container">
          <h1>🛒 Pesanan Saya</h1>

          {orders.length > 0 ? (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-info">
                      <h3>Pesanan #{order.id}</h3>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      <span className={`status-badge ${order.status}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>Item Pesanan:</h4>
                    <p>{order.items}</p>
                  </div>

                  <div className="order-footer">
                    <div className="order-total">
                      Total: <strong>Rp {order.total_price?.toLocaleString('id-ID')}</strong>
                    </div>
                    <Link to="/" className="continue-shopping">
                      Lanjut Belanja
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-orders">
              <p>😔 Belum ada pesanan</p>
              <Link to="/" className="start-ordering">
                Mulai Pesan
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Orders;
