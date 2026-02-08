import { useState } from 'react';
import { MapPin, Calendar, CheckCircle, XCircle, AlertTriangle, Image as ImageIcon, Phone, Mail, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import ImageUpload from '../components/ImageUpload';

export default function LostAndFound() {
  const { currentUser } = useAuth();
  const { posts, addPost, updatePostStatus } = useData();

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

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPosts = posts.filter(post => {
    const matchesType = filterType === 'all' || post.type === filterType;
    const matchesSearch = 
      post.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentUser) return;

    const newPost = {
      id: Date.now(),
      ...formData,
      status: formData.type, // 'lost' or 'found'
      userId: currentUser.id
    };
    addPost(newPost);
    setFormData({ type: 'lost', name: '', breed: '', location: '', date: '', description: '', image: '', contactEmail: '', contactPhone: '' });
  };

  const toggleStatus = (id) => {
    updatePostStatus(id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8 text-center">Lost & Found Pets</h1>

      {/* Submission Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-12 max-w-2xl mx-auto border-t-4 border-blue-500">
        <h2 className="text-xl font-semibold mb-4">Report a Pet</h2>
        {currentUser ? (
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
                        placeholder="your@email.com"
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
                        placeholder="(555) 123-4567"
                    />
                </div>
            </div>

            <ImageUpload 
                onImageSelect={(base64) => setFormData({ ...formData, image: base64 })}
                currentImage={formData.image}
                label="Photo of Pet"
            />

            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
                Post Report
            </button>
            </form>
        ) : (
            <div className="text-center py-6">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-2" />
                <p className="text-gray-600 mb-4">You must be logged in to report a lost or found pet.</p>
                <div className="flex justify-center gap-4">
                    <Link to="/login" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Login</Link>
                    <Link to="/signup" className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">Sign Up</Link>
                </div>
            </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
            <input
                type="text"
                placeholder="Search by name, breed, location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
                <Search className="w-5 h-5" />
            </div>
        </div>
        <select
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
        >
            <option value="all">All Posts</option>
            <option value="lost">Lost Pets</option>
            <option value="found">Found Pets</option>
        </select>
      </div>

      {/* Listings */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-lg">No posts match your search.</p>
            </div>
        ) : (
            filteredPosts.map((post) => (
          <div key={post.id} className={`bg-white rounded-lg shadow-lg overflow-hidden border-t-4 transition-all duration-300 ${post.status === 'reunited' ? 'border-green-500 opacity-75' : post.type === 'lost' ? 'border-red-500' : 'border-yellow-500'}`}>
            <div className="relative h-48 bg-gray-200 flex items-center justify-center">
              {post.image ? (
                <img src={post.image} alt={post.name} className={`w-full h-full object-cover ${post.status === 'reunited' ? 'grayscale' : ''}`} />
              ) : (
                <div className="text-gray-400 flex flex-col items-center">
                    <ImageIcon size={48} />
                    <span className="text-sm mt-2 font-medium">No Photo</span>
                </div>
              )}
              <div className={`absolute top-2 right-2 px-2 py-1 rounded text-xs font-bold uppercase text-white ${post.status === 'reunited' ? 'bg-green-500' : post.type === 'lost' ? 'bg-red-500' : 'bg-yellow-500'}`}>
                {post.status === 'reunited' ? 'Reunited' : post.type}
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center justify-between">
                  {post.name || 'Unknown Pet'}
                  {post.status === 'reunited' && <CheckCircle className="text-green-500 w-6 h-6" />}
              </h3>
              <p className="text-gray-600 text-sm mb-2">{post.breed}</p>
              
              {post.description && (
                  <p className="text-gray-700 text-sm mb-4 bg-gray-50 p-2 rounded border border-gray-100 italic">
                      "{post.description}"
                  </p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {post.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {post.date}
                </div>
              </div>

              {/* Contact Buttons */}
              <div className="flex gap-2 mt-4">
                  {post.contactEmail && (
                      <a 
                        href={`mailto:${post.contactEmail}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-md hover:bg-blue-100 border border-blue-200 transition-colors"
                      >
                          <Mail size={16} /> Email
                      </a>
                  )}
                  {post.contactPhone && (
                      <a 
                        href={`tel:${post.contactPhone}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-600 py-2 rounded-md hover:bg-green-100 border border-green-200 transition-colors"
                      >
                          <Phone size={16} /> Call
                      </a>
                  )}
              </div>

              {/* Only show button if user is logged in AND owns the post */}
              {currentUser && currentUser.id === post.userId && (
                  <button
                    onClick={() => toggleStatus(post.id)}
                    className={`mt-4 w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      post.status === 'reunited'
                        ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
                    }`}
                  >
                    {post.status === 'reunited' ? (
                      <>
                        <XCircle className="w-4 h-4 mr-2" />
                        Mark as Still {post.type === 'lost' ? 'Lost' : 'Found'}
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Mark as Reunited
                      </>
                    )}
                  </button>
              )}
            </div>
          </div>
        ))
      )}
      </div>
    </div>
  );
}
