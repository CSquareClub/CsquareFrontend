import { useState, useEffect } from 'react';
import api from '../utils/api';

const AdminToastManager = () => {
  const [toasts, setToasts] = useState([]);
  const [newToast, setNewToast] = useState({ message: '', eventId: '', photo: '', link: '' });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchToasts();
  }, []);

  const fetchToasts = async () => {
    try {
  const res = await api.get('/toast');
      setToasts(res.data.data);
    } catch (err) {
      setStatus('Failed to fetch toasts');
    }
  };

  const handleAddToast = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let photoUrl = '';
      if (photoFile) {
        const formData = new FormData();
        formData.append('photo', photoFile);
        const res = await api.post('/toast/photo', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        photoUrl = res.data.url;
      }
      // Only include eventId if it looks like a valid ObjectId (24 hex chars)
  const toastPayload = { message: newToast.message, photo: photoUrl };
  if (newToast.link) toastPayload.link = newToast.link;
      if (/^[a-fA-F0-9]{24}$/.test(newToast.eventId)) {
        toastPayload.eventId = newToast.eventId;
      }
      await api.post('/toast', toastPayload);
      setStatus('Toast added!');
  setNewToast({ message: '', eventId: '', photo: '', link: '' });
      setPhotoFile(null);
      fetchToasts();
    } catch (err) {
      setStatus('Failed to add toast');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteToast = async (id) => {
    if (!window.confirm('Delete this toast?')) return;
    setLoading(true);
    try {
  await api.delete(`/toast/${id}`);
      setStatus('Toast deleted!');
      fetchToasts();
    } catch (err) {
      setStatus('Failed to delete toast');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card p-6 bg-black/40 rounded-xl border border-gray-700 mt-8">
      <h3 className="text-xl font-bold text-white mb-6">Manage Toast Notifications</h3>
      <form onSubmit={handleAddToast} className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Toast message"
          value={newToast.message}
          onChange={e => setNewToast({ ...newToast, message: e.target.value })}
          className="px-4 py-2 rounded bg-black/50 border border-gray-600 text-white flex-1"
          required
        />
        <input
          type="text"
          placeholder="Link (optional)"
          value={newToast.link}
          onChange={e => setNewToast({ ...newToast, link: e.target.value })}
          className="px-4 py-2 rounded bg-black/50 border border-gray-600 text-white flex-1"
        />
        <input
          type="text"
          placeholder="Event ID (optional)"
          value={newToast.eventId}
          onChange={e => setNewToast({ ...newToast, eventId: e.target.value })}
          className="px-4 py-2 rounded bg-black/50 border border-gray-600 text-white flex-1"
        />
        <input
          type="file"
          accept="image/*"
          onChange={e => setPhotoFile(e.target.files[0])}
          className="px-4 py-2 rounded bg-black/50 border border-gray-600 text-white flex-1"
        />
        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Adding...' : 'Add Toast'}
        </button>
      </form>
      {status && <div className="mb-4 text-neon-cyan">{status}</div>}
      <ul className="space-y-4">
        {toasts.map(toast => (
          <li key={toast._id} className="flex justify-between items-center bg-black/30 p-4 rounded-lg border border-gray-600">
            <div className="flex items-center gap-4">
              {toast.photo && (
                <img src={toast.photo} alt="Toast" className="w-12 h-12 object-cover rounded" />
              )}
              <span className="text-white">{toast.message}</span>
            </div>
            <button onClick={() => handleDeleteToast(toast._id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-sm">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminToastManager;
