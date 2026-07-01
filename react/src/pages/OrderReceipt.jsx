import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrdersByUser } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Loading from '../components/Loading';
import './OrderReceipt.css';

const getStatusLabel = (status) => {
  const map = {
    pending: 'Menunggu Verifikasi Pembayaran',
    'Menunggu Verifikasi Pembayaran': 'Menunggu Verifikasi Pembayaran',
    diproses: 'Diproses',
    dikirim: 'Dikirim',
    selesai: 'Selesai',
    dibatalkan: 'Dibatalkan',
  };
  return map[status] || status || '-';
};

const getPaymentLabel = (method) => {
  const map = {
    bank: 'Transfer Bank (BCA - 1234567890)',
    ewallet: 'E-Wallet (OVO - 081234567890)',
    cod: 'COD (Bayar di Tempat)',
  };
  return map[method] || method || '-';
};

const OrderReceipt = () => {
  const { id } = useParams();
  const { user, loading: authLoading } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrder = async () => {
      try {
        const userId = user?.user_id || user?.id;
        if (!userId) return;
        const response = await getOrdersByUser(userId);
        const orders = Array.isArray(response?.data?.data) ? response.data.data : [];
        const found = orders.find(
          (o) => String(o.id || o.order_id) === String(id)
        );
        setOrder(found || null);
      } catch (err) {
        console.error('Error loading order:', err);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading) loadOrder();
  }, [authLoading, id, user]);

  const handlePrint = () => {
    window.print();
  };

  if (authLoading || loading) return <Loading message="Memuat bukti pembayaran..." />;

  if (!order) {
    return (
      <main style={{ padding: '3rem', textAlign: 'center' }}>
        <p>Pesanan tidak ditemukan.</p>
        <Link to="/my-orders">← Kembali ke Riwayat Pesanan</Link>
      </main>
    );
  }

  const orderId = order.id || order.order_id;
  const items = Array.isArray(order.items) ? order.items : [];
  const total = Number(order.total_price || order.total_harga || 0);
  const shipping = 15000;
  const subtotal = total - shipping;
  const orderDate = order.created_at
    ? new Date(order.created_at).toLocaleString('id-ID', {
        dateStyle: 'long',
        timeStyle: 'short',
      })
    : new Date().toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });

  return (
    <main className="receipt-page">
      {/* Tombol aksi - tidak ikut terprint */}
      <div className="receipt-actions no-print">
        <Link to="/my-orders" className="btn-back">← Kembali</Link>
        <button className="btn-print" onClick={handlePrint}>
          🖨️ Cetak / Simpan PDF
        </button>
      </div>

      {/* Area bukti pembayaran */}
      <div className="receipt-container" id="receipt">
        {/* Header */}
        <div className="receipt-header">
          <div className="receipt-logo">🍽️ CariMakan</div>
          <div className="receipt-title">BUKTI PEMBAYARAN</div>
          <div className="receipt-subtitle">carimakan.vercel.app</div>
        </div>

        <div className="receipt-divider" />

        {/* Info Order */}
        <div className="receipt-info">
          <div className="receipt-info-row">
            <span>No. Order</span>
            <span><strong>#{orderId}</strong></span>
          </div>
          <div className="receipt-info-row">
            <span>Tanggal</span>
            <span>{orderDate}</span>
          </div>
          <div className="receipt-info-row">
            <span>Status</span>
            <span className="receipt-status">{getStatusLabel(order.status)}</span>
          </div>
        </div>

        <div className="receipt-divider" />

        {/* Info Pembeli */}
        <div className="receipt-section">
          <div className="receipt-section-title">Data Pemesan</div>
          <div className="receipt-info-row">
            <span>Nama</span>
            <span>{order.customer || user?.nama || '-'}</span>
          </div>
          <div className="receipt-info-row">
            <span>No. HP</span>
            <span>{order.phone || order.nomor_hp || '-'}</span>
          </div>
          <div className="receipt-info-row">
            <span>Alamat</span>
            <span>{order.address || order.alamat_pengiriman || '-'}</span>
          </div>
          {(order.notes || order.catatan) && (
            <div className="receipt-info-row">
              <span>Catatan</span>
              <span>{order.notes || order.catatan}</span>
            </div>
          )}
        </div>

        <div className="receipt-divider" />

        {/* Daftar Item */}
        <div className="receipt-section">
          <div className="receipt-section-title">Daftar Pesanan</div>
          <table className="receipt-table">
            <thead>
              <tr>
                <th>Menu</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Harga</th>
                <th className="text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {items.length > 0 ? (
                items.map((item, index) => (
                  <tr key={index}>
                    <td>{item.productName || item.name || '-'}</td>
                    <td className="text-center">{item.quantity}</td>
                    <td className="text-right">Rp {Number(item.price || 0).toLocaleString('id-ID')}</td>
                    <td className="text-right">Rp {Number(item.subtotal || item.price * item.quantity || 0).toLocaleString('id-ID')}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="4" style={{ textAlign: 'center', color: '#888' }}>Tidak ada data item</td></tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="receipt-divider" />

        {/* Total */}
        <div className="receipt-totals">
          <div className="receipt-info-row">
            <span>Subtotal</span>
            <span>Rp {subtotal > 0 ? subtotal.toLocaleString('id-ID') : total.toLocaleString('id-ID')}</span>
          </div>
          <div className="receipt-info-row">
            <span>Ongkos Kirim</span>
            <span>Rp {shipping.toLocaleString('id-ID')}</span>
          </div>
          <div className="receipt-info-row receipt-total-row">
            <span><strong>TOTAL</strong></span>
            <span><strong>Rp {total.toLocaleString('id-ID')}</strong></span>
          </div>
        </div>

        <div className="receipt-divider" />

        {/* Metode Pembayaran */}
        <div className="receipt-section">
          <div className="receipt-section-title">Metode Pembayaran</div>
          <p className="receipt-payment">{getPaymentLabel(order.paymentMethod || order.payment_method)}</p>
        </div>

        <div className="receipt-divider" />

        {/* Footer */}
        <div className="receipt-footer">
          <p>Terima kasih telah berbelanja di CariMakan! 🙏</p>
          <p>Simpan bukti ini sebagai tanda bukti pembayaran Anda.</p>
          <p className="receipt-note">Dicetak pada: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>
    </main>
  );
};

export default OrderReceipt;
