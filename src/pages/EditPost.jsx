import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ImageUpload from '../components/ImageUpload';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { posts, updatePost } = useData();
  
  const [formData, setFormData] = useState({
    type: 'lost',
    name: '',
    breed: '',
    location: '',
    date: '',
    description: '',
    image: '',
    contactEmail: '',
    contactPhone: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
        navigate('/login');
        return;
    }

    const postToEdit = posts.find(p => p.id === parseInt(id));
    
    if (postToEdit) {
        if (postToEdit.userId !== currentUser.id) {
            alert("You are not authorized to edit this post.");
            navigate('/profile');
            return;
        }
        setFormData({
            type: postToEdit.type,
            name: postToEdit.name,
            breed: postToEdit.breed,
            location: postToEdit.location,
            date: postToEdit.date,
            description: postToEdit.description || '',
            image: postToEdit.image || '',
            contactEmail: postToEdit.contactEmail || '',
            contactPhone: postToEdit.contactPhone || ''
        });
    } else {
        // Handle case where post is not found (maybe deleted)
        navigate('/profile');
    }
    setLoading(false);
  }, [id, posts, currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updatePost(parseInt(id), formData);
    navigate('/profile');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Edit Report</h1>
      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="lost">Lost</option>
                <option value="found">Found</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Date</label>
              <input
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Pet Name (if known)</label>
              <input
                type="text"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Buddy"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Breed/Description</label>
              <input
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                placeholder="e.g. Golden Retriever"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g. Central Park, near the lake"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Additional Details / Medical Conditions</label>
            <textarea
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g. Has a red collar, needs insulin daily, very shy..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Email</label>
                <input
                    type="email"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Contact Phone</label>
                <input
                    type="tel"
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2"
                    value={formData.contactPhone}
                    onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                />
            </div>
          </div>

          <ImageUpload 
            onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
            currentImage={formData.image}
            label="Photo of Pet"
          />

          <div className="flex gap-4">
            <button
                type="button"
                onClick={() => navigate('/profile')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
            >
                Cancel
            </button>
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
