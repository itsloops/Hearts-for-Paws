import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, Navigate } from 'react-router-dom';
import { Building2, Calendar, Gift, Plus, Trash2, Edit, AlertCircle, CheckCircle } from 'lucide-react';

export default function OrgDashboard() {
  const { currentUser } = useAuth();
  const { 
    organizations, addOrganization, deleteOrganization,
    events, addEvent, deleteEvent,
    donationRequests, addDonationRequest, deleteDonationRequest
  } = useData();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showAddWishlist, setShowAddWishlist] = useState(false);

  // Forms state
  const [newEvent, setNewEvent] = useState({ title: '', date: '', time: '', location: '', type: 'Adoption Drive', description: '', contactEmail: '' });
  const [newWishlist, setNewWishlist] = useState({ item: '', quantity: '', urgency: 'Medium', description: '' });
  const [newOrg, setNewOrg] = useState({ name: '', type: 'Shelter', location: '', description: '', email: '', phone: '', website: '' });

  if (!currentUser) return <Navigate to="/login" />;

  const myOrg = organizations.find(org => org.userId === currentUser.id);

  // Handlers
  const handleCreateOrg = (e) => {
    e.preventDefault();
    addOrganization({ ...newOrg, id: Date.now(), userId: currentUser.id });
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    addEvent({ ...newEvent, id: Date.now(), userId: currentUser.id, orgId: myOrg.id });
    setShowAddEvent(false);
    setNewEvent({ title: '', date: '', time: '', location: '', type: 'Adoption Drive', description: '', contactEmail: '' });
  };

  const handleCreateWishlist = (e) => {
    e.preventDefault();
    addDonationRequest({ 
        ...newWishlist, 
        id: Date.now(), 
        userId: currentUser.id, 
        orgId: myOrg.id,
        rescueName: myOrg.name,
        fulfilled: false 
    });
    setShowAddWishlist(false);
    setNewWishlist({ item: '', quantity: '', urgency: 'Medium', description: '' });
  };

  if (!myOrg) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
            <div className="text-center mb-8">
                <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Register Your Organization</h1>
                <p className="text-gray-600">Create a profile for your shelter or rescue to manage events and wishlists.</p>
            </div>
            
            <form onSubmit={handleCreateOrg} className="space-y-6 max-w-2xl mx-auto">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Organization Name</label>
                    <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" value={newOrg.name} onChange={e => setNewOrg({...newOrg, name: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Type</label>
                        <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" value={newOrg.type} onChange={e => setNewOrg({...newOrg, type: e.target.value})}>
                            <option>Shelter</option>
                            <option>Rescue Group</option>
                            <option>Foster Network</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Location</label>
                        <input type="text" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" value={newOrg.location} onChange={e => setNewOrg({...newOrg, location: e.target.value})} />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2" rows="3" value={newOrg.description} onChange={e => setNewOrg({...newOrg, description: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">Create Organization Profile</button>
            </form>
        </div>
      </div>
    );
  }

  const myEvents = events.filter(e => e.userId === currentUser.id);
  const myWishlist = donationRequests.filter(r => r.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                    <Building2 className="text-blue-600" />
                    {myOrg.name}
                </h1>
                <p className="text-gray-500">{myOrg.location} • {myOrg.type}</p>
            </div>
            <Link to={`/edit-org/${myOrg.id}`} className="mt-4 md:mt-0 flex items-center text-blue-600 hover:text-blue-800 font-medium bg-blue-50 px-4 py-2 rounded-lg">
                <Edit size={16} className="mr-2" /> Edit Profile
            </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            <button onClick={() => setActiveTab('overview')} className={`pb-4 px-6 font-medium text-sm whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Overview</button>
            <button onClick={() => setActiveTab('events')} className={`pb-4 px-6 font-medium text-sm whitespace-nowrap ${activeTab === 'events' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Events ({myEvents.length})</button>
            <button onClick={() => setActiveTab('wishlist')} className={`pb-4 px-6 font-medium text-sm whitespace-nowrap ${activeTab === 'wishlist' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>Wishlist ({myWishlist.length})</button>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Active Events</h3>
                    <p className="text-3xl font-bold text-gray-900">{myEvents.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Wishlist Items</h3>
                    <p className="text-3xl font-bold text-gray-900">{myWishlist.length}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium uppercase mb-2">Fulfilled Items</h3>
                    <p className="text-3xl font-bold text-green-600">{myWishlist.filter(i => i.fulfilled).length}</p>
                </div>
            </div>
        )}

        {activeTab === 'events' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Manage Events</h2>
                    <button onClick={() => setShowAddEvent(!showAddEvent)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                        <Plus size={16} /> Add Event
                    </button>
                </div>

                {showAddEvent && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                        <h3 className="font-bold mb-4">Create New Event</h3>
                        <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Event Title" required className="p-2 border rounded" value={newEvent.title} onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
                            <input type="date" required className="p-2 border rounded" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
                            <input type="text" placeholder="Time (e.g. 10am - 2pm)" required className="p-2 border rounded" value={newEvent.time} onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
                            <input type="text" placeholder="Location" required className="p-2 border rounded" value={newEvent.location} onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
                            <select className="p-2 border rounded" value={newEvent.type} onChange={e => setNewEvent({...newEvent, type: e.target.value})}>
                                <option>Adoption Drive</option>
                                <option>Fundraiser</option>
                                <option>Volunteer Training</option>
                                <option>Social Meetup</option>
                            </select>
                            <input type="email" placeholder="Contact Email" required className="p-2 border rounded" value={newEvent.contactEmail} onChange={e => setNewEvent({...newEvent, contactEmail: e.target.value})} />
                            <textarea placeholder="Description" className="md:col-span-2 p-2 border rounded" rows="3" value={newEvent.description} onChange={e => setNewEvent({...newEvent, description: e.target.value})}></textarea>
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAddEvent(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Create Event</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {myEvents.map(event => (
                        <div key={event.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between items-center">
                            <div>
                                <h3 className="font-bold">{event.title}</h3>
                                <p className="text-sm text-gray-600">{event.date} • {event.location}</p>
                            </div>
                            <button onClick={() => deleteEvent(event.id)} className="text-red-500 hover:text-red-700 p-2"><Trash2 size={18} /></button>
                        </div>
                    ))}
                    {myEvents.length === 0 && <p className="text-gray-500 text-center py-8">No events scheduled.</p>}
                </div>
            </div>
        )}

        {activeTab === 'wishlist' && (
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Manage Wishlist</h2>
                    <button onClick={() => setShowAddWishlist(!showAddWishlist)} className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700">
                        <Plus size={16} /> Add Item
                    </button>
                </div>

                {showAddWishlist && (
                    <div className="bg-gray-50 p-6 rounded-lg mb-8 border border-gray-200">
                        <h3 className="font-bold mb-4">Request Item</h3>
                        <form onSubmit={handleCreateWishlist} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input type="text" placeholder="Item Name (e.g. Puppy Food)" required className="p-2 border rounded" value={newWishlist.item} onChange={e => setNewWishlist({...newWishlist, item: e.target.value})} />
                            <input type="text" placeholder="Quantity (e.g. 5 bags)" required className="p-2 border rounded" value={newWishlist.quantity} onChange={e => setNewWishlist({...newWishlist, quantity: e.target.value})} />
                            <select className="p-2 border rounded" value={newWishlist.urgency} onChange={e => setNewWishlist({...newWishlist, urgency: e.target.value})}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                                <option>Critical</option>
                            </select>
                            <input type="text" placeholder="Description (optional)" className="p-2 border rounded" value={newWishlist.description} onChange={e => setNewWishlist({...newWishlist, description: e.target.value})} />
                            <div className="md:col-span-2 flex justify-end gap-2">
                                <button type="button" onClick={() => setShowAddWishlist(false)} className="px-4 py-2 text-gray-600">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add to Wishlist</button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myWishlist.map(item => (
                        <div key={item.id} className={`bg-white p-4 rounded-lg shadow border-l-4 ${item.fulfilled ? 'border-green-500' : 'border-blue-500'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold">{item.item}</h3>
                                    <p className="text-sm text-gray-600">{item.quantity} • {item.urgency} Priority</p>
                                </div>
                                <button onClick={() => deleteDonationRequest(item.id)} className="text-red-500 hover:text-red-700"><Trash2 size={16} /></button>
                            </div>
                            {item.fulfilled && (
                                <div className="mt-2 bg-green-50 text-green-700 text-xs font-bold px-2 py-1 rounded inline-flex items-center">
                                    <CheckCircle size={12} className="mr-1" /> Fulfilled
                                </div>
                            )}
                        </div>
                    ))}
                    {myWishlist.length === 0 && <p className="col-span-full text-gray-500 text-center py-8">Wishlist is empty.</p>}
                </div>
            </div>
        )}
    </div>
  );
}
