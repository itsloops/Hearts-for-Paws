import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ImageUpload from '../components/ImageUpload';

export default function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { events, updateEvent } = useData();
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    location: '',
    type: 'Adoption Drive',
    description: '',
    contactEmail: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);

  const officialEventTypes = ['Adoption Drive', 'Vaccination', 'Fundraiser', 'Training Workshop'];
  const meetupTypes = ['Social Meetup', 'Walking Group'];
  const allEventTypes = [...officialEventTypes, ...meetupTypes];

  useEffect(() => {
    if (!currentUser) {
        navigate('/login');
        return;
    }

    const eventToEdit = events.find(e => e.id === parseInt(id));
    
    if (eventToEdit) {
        if (eventToEdit.userId !== currentUser.id) {
            alert("You are not authorized to edit this event.");
            navigate('/profile');
            return;
        }
        setFormData({
            title: eventToEdit.title,
            date: eventToEdit.date,
            time: eventToEdit.time,
            location: eventToEdit.location,
            type: eventToEdit.type,
            description: eventToEdit.description,
            contactEmail: eventToEdit.contactEmail || '',
            image: eventToEdit.image || ''
        });
    } else {
        navigate('/profile');
    }
    setLoading(false);
  }, [id, events, currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateEvent(parseInt(id), formData);
    navigate('/profile');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Edit Event</h1>
      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-500">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                {allEventTypes.map(type => <option key={type} value={type}>{type}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input
                type="text"
                required
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
                <input
                    type="email"
                    className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <ImageUpload 
                  onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
                  currentImage={formData.image}
                  label="Event Image (Optional)"
              />
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => navigate('/profile')}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
