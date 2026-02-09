import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ImageUpload from '../components/ImageUpload';

export default function EditOrganization() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { organizations, updateOrganization } = useData();
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rescue',
    specialty: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    donationLink: '',
    amazonWishlist: '',
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
        navigate('/login');
        return;
    }

    const orgToEdit = organizations.find(o => o.id === parseInt(id));
    
    if (orgToEdit) {
        if (orgToEdit.userId !== currentUser.id) {
            alert("You are not authorized to edit this organization.");
            navigate('/profile');
            return;
        }
        setFormData({
            name: orgToEdit.name,
            category: orgToEdit.category,
            specialty: orgToEdit.specialty,
            phone: orgToEdit.phone,
            email: orgToEdit.email || '',
            website: orgToEdit.website,
            address: orgToEdit.address,
            donationLink: orgToEdit.donationLink,
            amazonWishlist: orgToEdit.amazonWishlist || '',
            description: orgToEdit.description,
            image: orgToEdit.image || ''
        });
    } else {
        navigate('/profile');
    }
    setLoading(false);
  }, [id, organizations, currentUser, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateOrganization(parseInt(id), formData);
    navigate('/profile');
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Edit Organization</h1>
      <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-500">
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <input required type="text" className="mt-1 block w-full border rounded-md p-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <select className="mt-1 block w-full border rounded-md p-2" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
                        <option value="Rescue">Rescue</option>
                        <option value="Shelter">Shelter</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Specialty</label>
                    <input required type="text" className="mt-1 block w-full border rounded-md p-2" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone</label>
                    <input required type="tel" className="mt-1 block w-full border rounded-md p-2" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input required type="email" className="mt-1 block w-full border rounded-md p-2" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Website</label>
                    <input required type="url" className="mt-1 block w-full border rounded-md p-2" value={formData.website} onChange={e => setFormData({...formData, website: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Address</label>
                    <input required type="text" className="mt-1 block w-full border rounded-md p-2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Donation Page URL</label>
                    <input type="url" className="mt-1 block w-full border rounded-md p-2" value={formData.donationLink} onChange={e => setFormData({...formData, donationLink: e.target.value})} />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Amazon Wishlist URL</label>
                    <input type="url" className="mt-1 block w-full border rounded-md p-2" value={formData.amazonWishlist} onChange={e => setFormData({...formData, amazonWishlist: e.target.value})} placeholder="https://amazon.com/..." />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea required className="mt-1 block w-full border rounded-md p-2" rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}></textarea>
            </div>
            
            <ImageUpload 
                onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
                currentImage={formData.image}
                label="Organization Logo/Image"
            />

            <div className="flex justify-end gap-4">
                <button type="button" onClick={() => navigate('/profile')} className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md">Cancel</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Save Changes</button>
            </div>
        </form>
      </div>
    </div>
  );
}
