import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetOrders, adminUpdateOrderStatus } from '../../services/adminService';
import './AdminOrders.css';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await adminGetOrders();
      setOrders(response.data);
    } catch (err) {
      setError(err.message || 'Error loading orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { label: '⏳ Menunggu Verifikasi Pembayaran', class: 'pending' },
      diproses: { label: '🔄 Diproses', class: 'processing' },
      dikirim: { label: '📦 Dikirim', class: 'shipped' },
      selesai: { label: '✅ Selesai', class: 'completed' },
      dibatalkan: { label: '❌ Dibatalkan', class: 'cancelled' }
    };
    return badges[status] || { label: status, class: 'pending' };
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await adminUpdateOrderStatus(orderId, status);
      loadOrders();
    } catch (err) {
      setError(err.message || 'Error updating order status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <p>Memuat data pesanan...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-orders-page">
        <h1>📦 Kelola Pesanan</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="orders-table-container">
          {orders.length === 0 ? (
            <p className="no-data">Belum ada pesanan</p>
          ) : (
            <table className="orders-table">
              <thead>
                <tr>
                  <th>ID Pesanan</th>
                  <th>Nama User</th>
                  <th>Total</th>
                  <th>Item</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => {
                  const status = getStatusBadge(order.status);
                  return (
                    <tr key={order.order_id}>
                      <td className="order-id">#{order.order_id}</td>
                      <td>
                        <div className="user-info">
                          <strong>{order.nama}</strong>
                          <span className="username">@{order.username}</span>
                        </div>
                      </td>
                      <td className="price">
                        Rp {order.total_harga.toLocaleString('id-ID')}
                      </td>
                      <td className="item-count">
                        {order.item_count} item
                      </td>
                      <td>
                        <div className="status-control">
                          <span className={`status ${status.class}`}>
                            {status.label}
                          </span>
                          <select
                            defaultValue={order.status}
                            onChange={(e) => handleStatusChange(order.order_id, e.target.value)}
                          >
                            <option value="pending">Menunggu Verifikasi Pembayaran</option>
                            <option value="diproses">Diproses</option>
                            <option value="dikirim">Dikirim</option>
                            <option value="selesai">Selesai</option>
                            <option value="dibatalkan">Dibatalkan</option>
                          </select>
                        </div>
                      </td>
                      <td className="date-cell">
                        {new Date(order.created_at).toLocaleDateString('id-ID', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="orders-stats">
          <div className="stat-card">
            <div className="stat-label">Total Pesanan</div>
            <div className="stat-value">{orders.length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Total Nilai</div>
            <div className="stat-value">
              Rp {orders.reduce((total, order) => total + Number(order.total_harga || 0), 0).toLocaleString('id-ID')}
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Menunggu</div>
            <div className="stat-value">{orders.filter(o => o.status === 'pending').length}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">Selesai</div>
            <div className="stat-value">{orders.filter(o => o.status === 'selesai').length}</div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
