import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetFoods, adminCreateFood, adminUpdateFood, adminDeleteFood, adminToggleFoodStatus } from '../../services/adminService';
import './AdminFoods.css';

const AdminFoods = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    nama_makanan: '',
    category_id: 1,
    deskripsi: '',
    harga: '',
    gambar: '',
    asal_daerah: '',
    alamat_resto: ''
  });

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await adminGetFoods();
      setFoods(response.data);
    } catch (err) {
      setError(err.message || 'Error loading foods');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nama_makanan || !formData.harga) {
      setError('Nama makanan dan harga wajib diisi');
      return;
    }

    try {
      if (editingId) {
        await adminUpdateFood(editingId, formData);
        alert('Makanan berhasil diperbarui');
      } else {
        await adminCreateFood(formData);
        alert('Makanan berhasil ditambahkan');
      }
      
      setFormData({
        nama_makanan: '',
        category_id: 1,
        deskripsi: '',
        harga: '',
        gambar: '',
        asal_daerah: '',
        alamat_resto: ''
      });
      setShowForm(false);
      setEditingId(null);
      loadFoods();
    } catch (err) {
      setError(err.message || 'Error saving food');
    }
  };

  const handleEdit = (food) => {
    setFormData({
      nama_makanan: food.nama_makanan,
      category_id: food.category_id || 1,
      deskripsi: food.deskripsi || '',
      harga: food.harga,
      gambar: food.gambar || '',
      asal_daerah: food.asal_daerah || '',
      alamat_resto: food.alamat_resto || ''
    });
    setEditingId(food.food_id);
    setShowForm(true);
  };

  const handleToggleStatus = async (food) => {
    try {
      const result = await adminToggleFoodStatus(food.food_id);
      alert(result.message || 'Status berhasil diubah');
      loadFoods();
    } catch (err) {
      setError(err.message || 'Error mengubah status makanan');
    }
  };

  const handleDelete = async (foodId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus makanan ini?')) {
      try {
        await adminDeleteFood(foodId);
        alert('Makanan berhasil dihapus');
        loadFoods();
      } catch (err) {
        setError(err.message || 'Error deleting food');
      }
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({
      nama_makanan: '',
      category_id: 1,
      deskripsi: '',
      harga: '',
      gambar: '',
      asal_daerah: '',
      alamat_resto: ''
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <p>Memuat data makanan...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-foods-page">
        <div className="page-header">
          <h1>🍽️ Kelola Makanan</h1>
          <button 
            className="btn-add"
            onClick={() => setShowForm(true)}
          >
            ➕ Tambah Makanan
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {showForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h2>{editingId ? 'Edit Makanan' : 'Tambah Makanan Baru'}</h2>
                <button className="close-btn" onClick={handleCancel}>✕</button>
              </div>

              <form onSubmit={handleSubmit} className="food-form">
                <div className="form-group">
                  <label htmlFor="nama_makanan">Nama Makanan *</label>
                  <input
                    type="text"
                    id="nama_makanan"
                    name="nama_makanan"
                    value={formData.nama_makanan}
                    onChange={handleInputChange}
                    placeholder="Contoh: Rendang"
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="harga">Harga *</label>
                    <input
                      type="number"
                      id="harga"
                      name="harga"
                      value={formData.harga}
                      onChange={handleInputChange}
                      placeholder="35000"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category_id">Kategori</label>
                    <select
                      id="category_id"
                      name="category_id"
                      value={formData.category_id}
                      onChange={handleInputChange}
                    >
                      <option value="1">Makanan Utama</option>
                      <option value="2">Minuman</option>
                      <option value="3">Dessert</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="deskripsi">Deskripsi</label>
                  <textarea
                    id="deskripsi"
                    name="deskripsi"
                    value={formData.deskripsi}
                    onChange={handleInputChange}
                    placeholder="Deskripsi makanan..."
                    rows="3"
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="asal_daerah">Asal Daerah</label>
                    <input
                      type="text"
                      id="asal_daerah"
                      name="asal_daerah"
                      value={formData.asal_daerah}
                      onChange={handleInputChange}
                      placeholder="Contoh: Sumatera Barat"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="gambar">URL Gambar</label>
                    <input
                      type="text"
                      id="gambar"
                      name="gambar"
                      value={formData.gambar}
                      onChange={handleInputChange}
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="alamat_resto">Alamat Restoran</label>
                  <input
                    type="text"
                    id="alamat_resto"
                    name="alamat_resto"
                    value={formData.alamat_resto}
                    onChange={handleInputChange}
                    placeholder="Contoh: Jl. Sudirman No. 10, Jakarta Pusat"
                  />
                </div>

                <div className="modal-footer">
                  <button type="button" className="btn-cancel" onClick={handleCancel}>
                    Batal
                  </button>
                  <button type="submit" className="btn-submit">
                    {editingId ? 'Simpan Perubahan' : 'Tambah Makanan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="foods-table-container">
          {foods.length === 0 ? (
            <p className="no-data">Belum ada makanan</p>
          ) : (
            <table className="foods-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Harga</th>
                  <th>Daerah</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {foods.map(food => (
                  <tr key={food.food_id}>
                    <td>#{food.food_id}</td>
                    <td>{food.nama_makanan}</td>
                    <td>Rp {food.harga.toLocaleString('id-ID')}</td>
                    <td>{food.asal_daerah || '-'}</td>
                    <td>⭐ {food.rating || 0}</td>
                    <td>
                      <span className={`status ${food.is_active ? 'active' : 'inactive'}`}>
                        {food.is_active ? '✓ Aktif' : '✗ Nonaktif'}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button 
                        className={`btn-toggle ${food.is_active ? 'btn-deactivate' : 'btn-activate'}`}
                        onClick={() => handleToggleStatus(food)}
                        title={food.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        {food.is_active ? '⏸ Nonaktifkan' : '▶ Aktifkan'}
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEdit(food)}
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDelete(food.food_id)}
                      >
                        🗑️ Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminFoods;
