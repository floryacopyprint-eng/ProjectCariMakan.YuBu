import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminGetUsers, adminUpdateUserProfile, adminUpdateUserRole, adminUpdateUserStatus } from '../../services/adminService';
import './AdminUsers.css';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ nama: '', username: '', email: '', foto_profil: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminGetUsers();
      setUsers(response.data);
    } catch (err) {
      setError(err.message || 'Error loading users');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      nama: user.nama || '',
      username: user.username || '',
      email: user.email || '',
      foto_profil: user.foto_profil || ''
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setFormData({ nama: '', username: '', email: '', foto_profil: '' });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({ ...prev, foto_profil: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      setSubmitting(true);
      await adminUpdateUserProfile(editingUser.user_id, formData);
      alert('Profil user berhasil diperbarui');
      handleCloseModal();
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error updating profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminUpdateUserRole(userId, newRole);
      alert('Role user berhasil diubah');
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error updating role');
    }
  };

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await adminUpdateUserStatus(userId, newStatus);
      alert(`User ${newStatus ? 'diaktifkan' : 'dinonaktifkan'}`);
      loadUsers();
    } catch (err) {
      setError(err.message || 'Error updating status');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="loading-container">
          <p>Memuat data user...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-users-page">
        <h1>👥 Kelola User</h1>

        {error && <div className="error-message">{error}</div>}

        <div className="users-table-container">
          {users.length === 0 ? (
            <p className="no-data">Belum ada user</p>
          ) : (
            <table className="users-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nama</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Terdaftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_id}>
                    <td>#{user.user_id}</td>
                    <td>
                      <div className="user-cell">
                        <img
                          src={user.foto_profil || 'https://via.placeholder.com/40x40?text=User'}
                          alt={user.nama}
                          className="user-avatar"
                        />
                        <span>{user.nama}</span>
                      </div>
                    </td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select 
                        value={user.role_id} 
                        onChange={(e) => handleRoleChange(user.user_id, parseInt(e.target.value))}
                        className="role-select"
                        disabled={user.user_id === 1} // Prevent changing super admin
                      >
                        <option value="1">Admin</option>
                        <option value="2">User</option>
                      </select>
                    </td>
                    <td>
                      <span className={`status ${user.is_active ? 'active' : 'inactive'}`}>
                        {user.is_active ? '✓ Aktif' : '✗ Nonaktif'}
                      </span>
                    </td>
                    <td className="date-cell">
                      {new Date(user.created_at).toLocaleDateString('id-ID')}
                    </td>
                    <td className="action-buttons">
                      <button 
                        className="btn-edit"
                        onClick={() => handleOpenEditModal(user)}
                      >
                        ✏️ Edit Profil
                      </button>
                      <button 
                        className={`btn-status ${user.is_active ? 'btn-deactivate' : 'btn-activate'}`}
                        onClick={() => handleStatusChange(user.user_id, !user.is_active)}
                        disabled={user.user_id === 1}
                      >
                        {user.is_active ? '🔒 Nonaktifkan' : '🔓 Aktifkan'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {isModalOpen && editingUser && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Edit Profil User</h3>
                <button className="modal-close" onClick={handleCloseModal}>×</button>
              </div>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="profile-preview">
                  <img
                    src={formData.foto_profil || 'https://via.placeholder.com/120x120?text=User'}
                    alt="Preview"
                  />
                </div>
                <label>
                  Foto Profil
                  <input type="file" accept="image/*" onChange={handleImageUpload} />
                </label>
                <label>
                  Nama Lengkap
                  <input
                    type="text"
                    value={formData.nama}
                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Username
                  <input
                    type="text"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    required
                  />
                </label>
                <label>
                  Email
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </label>
                <div className="modal-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseModal}>Batal</button>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="user-stats">
          <div className="stat">
            <span className="label">Total User</span>
            <span className="value">{users.length}</span>
          </div>
          <div className="stat">
            <span className="label">Admin</span>
            <span className="value">{users.filter(u => u.role_id === 1).length}</span>
          </div>
          <div className="stat">
            <span className="label">User Biasa</span>
            <span className="value">{users.filter(u => u.role_id === 2).length}</span>
          </div>
          <div className="stat">
            <span className="label">User Aktif</span>
            <span className="value">{users.filter(u => u.is_active).length}</span>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
