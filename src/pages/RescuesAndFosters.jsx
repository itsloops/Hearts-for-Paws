import { useState } from 'react';
import { Phone, Globe, MapPin, Heart, Search, Filter, Home, Plus, Mail, Gift, Star, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

export default function RescuesAndFosters() {
  const { currentUser } = useAuth();
  const { organizations, addOrganization } = useData();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedBreed, setSelectedBreed] = useState('All');
  
  // Rescue of the Month Logic
  const currentMonthIndex = new Date().getMonth();
  const rescueOfTheMonth = organizations.length > 0 
    ? organizations[currentMonthIndex % organizations.length] 
    : null;

  // Registration Form State
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Rescue',
    specialty: '',
    phone: '',
    email: '',
    website: '',
    address: '',
    donationLink: '',
    description: '',
    image: ''
  });

  const specialties = ['All', ...new Set((organizations || []).map(r => r?.specialty).filter(Boolean))];
  const categories = ['All', 'Rescue', 'Shelter'];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    
    const newOrg = {
        id: Date.now(),
        ...formData,
        userId: currentUser.id
    };
    addOrganization(newOrg);
    setFormData({
        name: '',
        category: 'Rescue',
        specialty: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        donationLink: '',
        description: '',
        image: ''
    });
    setShowForm(false);
  };

  const filteredOrgs = (organizations || []).filter(org => {
    if (!org) return false;
    const matchesSearch = (org.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
                          (org.specialty?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                          (org.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || org.category === selectedCategory;
    const matchesBreed = selectedBreed === 'All' || org.specialty === selectedBreed;

    return matchesSearch && matchesCategory && matchesBreed;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Rescues, Fosters & Shelters</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Find local organizations dedicated to helping animals. Filter by breed, type, or search for a specific rescue.
        </p>
      </div>

      {/* Featured Rescue Section */}
      {rescueOfTheMonth && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-6 mb-8 rounded-r-lg shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-center">
            <div className="w-full md:w-1/3">
              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-white shadow-inner flex items-center justify-center h-48">
                {rescueOfTheMonth.image ? (
                  <img 
                    src={rescueOfTheMonth.image} 
                    alt={rescueOfTheMonth.name} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Star className="w-16 h-16 text-blue-300" />
                )}
              </div>
            </div>
            <div className="w-full md:w-2/3">
              <div className="flex items-center gap-2 text-blue-600 font-bold mb-2 uppercase tracking-wide text-sm">
                <Star className="w-5 h-5 fill-current" />
                <span>Rescue of the Month</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-3">{rescueOfTheMonth.name}</h2>
              <p className="text-gray-600 mb-4 line-clamp-3 text-lg leading-relaxed">{rescueOfTheMonth.description}</p>
              
              <div className="flex flex-wrap gap-4 items-center text-sm text-gray-500 mb-4">
                 <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {rescueOfTheMonth.location || rescueOfTheMonth.address}
                 </div>
                 {rescueOfTheMonth.specialty && (
                    <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {rescueOfTheMonth.specialty}
                    </div>
                 )}
              </div>

              <div className="flex flex-wrap gap-3">
                 {rescueOfTheMonth.website && (
                     <a 
                     href={rescueOfTheMonth.website}
                     target="_blank"
                     rel="noopener noreferrer"
                     className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
                     >
                     Visit Website <ArrowRight className="w-4 h-4" />
                     </a>
                 )}
                 {rescueOfTheMonth.donationLink && (
                    <a 
                        href={rescueOfTheMonth.donationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 bg-white text-gray-700 border border-gray-300 px-5 py-2 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                    >
                        Donate
                    </a>
                 )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 w-full flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                    type="text"
                    placeholder="Search rescues, breeds, or locations..."
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative w-full md:w-48">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                        {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    </div>

                    <div className="relative w-full md:w-48">
                    <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <select
                        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none appearance-none bg-white"
                        value={selectedBreed}
                        onChange={(e) => setSelectedBreed(e.target.value)}
                    >
                        {specialties.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                        ))}
                    </select>
                    </div>
                </div>
            </div>
            {currentUser && (
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 whitespace-nowrap"
                >
                    <Plus size={20} />
                    Register Org
                </button>
            )}
        </div>
      </div>

      {/* Registration Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-t-4 border-blue-500 animate-fade-in">
            <h2 className="text-xl font-semibold mb-4">Register an Organization</h2>
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
                        <label className="block text-sm font-medium text-gray-700">Specialty (e.g., German Shepherds, All)</label>
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
                    <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Register Organization</button>
                </div>
            </form>
        </div>
      )}

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOrgs.map((org) => (
          <div key={org.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden relative bg-gray-100 flex items-center justify-center">
              {org.image ? (
                <img 
                    src={org.image} 
                    alt={org.name} 
                    className="w-full h-full object-cover"
                />
              ) : (
                <Home className="w-16 h-16 text-gray-300" />
              )}
              <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide text-blue-600 shadow-sm">
                {org.category}
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{org.name}</h3>
              <p className="text-blue-600 font-medium mb-4 flex items-center">
                <Heart className="w-4 h-4 mr-2" />
                {org.specialty}
              </p>
              
              <p className="text-gray-600 mb-6 line-clamp-3">
                {org.description}
              </p>
              
              <div className="space-y-2 text-sm text-gray-500 mb-6">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {org.address}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-2" />
                  {org.phone}
                </div>
                {org.email && (
                    <div className="flex items-center">
                    <Mail className="w-4 h-4 mr-2" />
                    <a 
                        href={`mailto:${org.email}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                    >
                        {org.email}
                    </a>
                    </div>
                )}
                <div className="flex items-center">
                  <Globe className="w-4 h-4 mr-2" />
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    Visit Website
                  </a>
                </div>
              </div>

              <div className="space-y-2 mt-4">
                  {org.donationLink && (
                    <a 
                        href={org.donationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-md transition-colors"
                    >
                        Donate
                    </a>
                  )}
                  {org.amazonWishlist && (
                    <a 
                        href={org.amazonWishlist}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full text-center bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-semibold py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2"
                    >
                        <Gift size={16} />
                        Amazon Wishlist
                    </a>
                  )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredOrgs.length === 0 && (
        <div className="text-center py-12">
          <Home className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No organizations found</h3>
          <p className="text-gray-600">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
}
