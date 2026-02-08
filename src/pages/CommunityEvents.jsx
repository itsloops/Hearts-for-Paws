import { useState } from 'react';
import { Calendar, MapPin, Plus, Clock, Tag, Filter, Users, HeartHandshake, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import ImageUpload from '../components/ImageUpload';

export default function CommunityEvents() {
  const { currentUser } = useAuth();
  const { events, addEvent } = useData();

  const [activeTab, setActiveTab] = useState('events'); // 'events' or 'meetups'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [showForm, setShowForm] = useState(false);

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

  const allEventTypes = [
    'Adoption Drive', 
    'Vaccination', 
    'Fundraiser', 
    'Training Workshop', 
    'Social Meetup', 
    'Walking Group'
  ];

  const officialEventTypes = ['Adoption Drive', 'Vaccination', 'Fundraiser', 'Training Workshop'];
  const meetupTypes = ['Social Meetup', 'Walking Group'];

  // Dynamic filter options based on active tab
  const filterOptions = activeTab === 'events' ? officialEventTypes : meetupTypes;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newEvent = {
      id: Date.now(),
      ...formData,
      userId: currentUser?.id
    };
    addEvent(newEvent);
    setFormData({
      title: '',
      date: '',
      time: '',
      location: '',
      type: activeTab === 'events' ? 'Adoption Drive' : 'Social Meetup',
      description: '',
      contactEmail: '',
      image: ''
    });
    setShowForm(false);
  };

  const filteredEvents = events.filter(event => {
    const isMeetup = meetupTypes.includes(event.type);
    
    // Tab filtering
    if (activeTab === 'events' && isMeetup) return false;
    if (activeTab === 'meetups' && !isMeetup) return false;

    // Search filtering
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Type dropdown filtering
    const matchesType = selectedType === 'All' || event.type === selectedType;

    return matchesSearch && matchesType;
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Community Hub</h1>
          <p className="text-gray-600 mt-2">Connect with the local pet community.</p>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => { setActiveTab('events'); setSelectedType('All'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'events' 
                ? 'bg-white text-purple-600 shadow-sm font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <HeartHandshake size={18} />
            Official Events
          </button>
          <button
            onClick={() => { setActiveTab('meetups'); setSelectedType('All'); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
              activeTab === 'meetups' 
                ? 'bg-white text-pink-600 shadow-sm font-medium' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Users size={18} />
            Meetups
          </button>
        </div>

        {currentUser && (
          <button
            onClick={() => setShowForm(!showForm)}
            className={`flex items-center gap-2 text-white px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeTab === 'events' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-pink-500 hover:bg-pink-600'
            }`}
          >
            <Plus size={20} />
            Post {activeTab === 'events' ? 'Event' : 'Meetup'}
          </button>
        )}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none ${
                activeTab === 'events' ? 'focus:ring-purple-500' : 'focus:ring-pink-500'
              }`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative w-full md:w-64">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 outline-none appearance-none bg-white ${
                activeTab === 'events' ? 'focus:ring-purple-500' : 'focus:ring-pink-500'
              }`}
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <option value="All">All Types</option>
              {filterOptions.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Post Form */}
      {showForm && (
        <div className={`bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 animate-fade-in ${
          activeTab === 'events' ? 'border-purple-500' : 'border-pink-500'
        }`}>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {activeTab === 'events' ? 'Add New Official Event' : 'Host a Meetup'}
          </h2>
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
                  placeholder={activeTab === 'events' ? "e.g., Annual Gala" : "e.g., Pug Playdate"}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {activeTab === 'events' 
                    ? officialEventTypes.map(type => <option key={type} value={type}>{type}</option>)
                    : meetupTypes.map(type => <option key={type} value={type}>{type}</option>)
                  }
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
                  placeholder="e.g., 10:00 AM - 2:00 PM"
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
                  placeholder="Address or Venue Name"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email (Optional)</label>
                <input
                  type="email"
                  className="w-full border rounded-lg p-2 focus:ring-2 outline-none focus:ring-blue-500"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  placeholder="organizer@example.com"
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
                  placeholder="Details about the event..."
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
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  activeTab === 'events' ? 'bg-purple-600 hover:bg-purple-700' : 'bg-pink-500 hover:bg-pink-600'
                }`}
              >
                Publish {activeTab === 'events' ? 'Event' : 'Meetup'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                {event.image ? (
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                ) : (
                    <div className="text-gray-400 flex flex-col items-center">
                        {activeTab === 'events' ? <Calendar size={48} /> : <Users size={48} />}
                        <span className="text-sm mt-2 font-medium">No Image</span>
                    </div>
                )}
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium 
                  ${event.type === 'Adoption Drive' ? 'bg-blue-100 text-blue-800' :
                    event.type === 'Vaccination' ? 'bg-green-100 text-green-800' :
                    event.type === 'Social Meetup' ? 'bg-pink-100 text-pink-800' :
                    event.type === 'Walking Group' ? 'bg-orange-100 text-orange-800' :
                    'bg-purple-100 text-purple-800'}`}>
                  {event.type}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
              
              <div className="space-y-2 text-gray-600 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={18} className={activeTab === 'events' ? "text-purple-500" : "text-pink-500"} />
                  <span className="text-sm">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} className={activeTab === 'events' ? "text-purple-500" : "text-pink-500"} />
                  <span className="text-sm">{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={18} className={activeTab === 'events' ? "text-purple-500" : "text-pink-500"} />
                  <span className="text-sm">{event.location}</span>
                </div>
              </div>
              
              <p className="text-gray-600 text-sm border-t pt-4 mb-4">
                {event.description}
              </p>

              {event.contactEmail && (
                <a 
                    href={`mailto:${event.contactEmail}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center gap-2 w-full py-2 rounded-lg transition-colors border ${
                    activeTab === 'events' 
                    ? 'border-purple-200 text-purple-700 hover:bg-purple-50' 
                    : 'border-pink-200 text-pink-700 hover:bg-pink-50'
                }`}>
                    <Mail size={16} /> Contact Organizer
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
             activeTab === 'events' ? 'bg-purple-100 text-purple-500' : 'bg-pink-100 text-pink-500'
          }`}>
            {activeTab === 'events' ? <Calendar size={32} /> : <Users size={32} />}
          </div>
          <h3 className="text-lg font-medium text-gray-900">No {activeTab} found</h3>
          <p className="text-gray-600">Be the first to post one!</p>
        </div>
      )}
    </div>
  );
}
