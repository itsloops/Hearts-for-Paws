import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, Navigate } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, Package, AlertCircle, Trash2, Users, Image as ImageIcon, Home, Edit } from 'lucide-react';

export default function Profile() {
  const { currentUser } = useAuth();
  const { 
    posts, 
    updatePostStatus, 
    deletePost,
    donationRequests, 
    toggleDonationStatus,
    events,
    deleteEvent,
    organizations,
    deleteOrganization
  } = useData();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const myPosts = posts.filter(post => post.userId === currentUser.id);
  const myPledges = donationRequests.filter(req => req.pledgedBy === currentUser.id);
  const myEvents = events.filter(event => event.userId === currentUser.id);
  const myOrganizations = organizations.filter(org => org.userId === currentUser.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-4 rounded-full">
                <span className="text-2xl font-bold text-blue-600">{currentUser.name.charAt(0).toUpperCase()}</span>
            </div>
            <div>
                <p className="text-xl font-semibold">{currentUser.name}</p>
                <p className="text-gray-600">{currentUser.email}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* My Reported Pets */}
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Reported Pets</h2>
            {myPosts.length === 0 ? (
                <p className="text-gray-500 bg-white p-6 rounded-lg shadow">You haven't reported any pets yet.</p>
            ) : (
                <div className="space-y-4">
                    {myPosts.map(post => (
                        <div key={post.id} className={`bg-white rounded-lg shadow p-4 flex gap-4 ${post.status === 'reunited' ? 'opacity-75' : ''}`}>
                            <div className="w-24 h-24 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                                {post.image ? (
                                    <img 
                                        src={post.image} 
                                        alt={post.name} 
                                        className="w-full h-full object-cover rounded-md"
                                    />
                                ) : (
                                    <ImageIcon className="text-gray-400" size={32} />
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{post.name || 'Unknown'}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${
                                        post.status === 'lost' ? 'bg-red-100 text-red-800' :
                                        post.status === 'found' ? 'bg-green-100 text-green-800' :
                                        'bg-gray-100 text-gray-800'
                                    }`}>
                                        {post.status}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{post.breed}</p>
                                <p className="text-sm text-gray-500 flex items-center mt-1">
                                    <MapPin size={14} className="mr-1" /> {post.location}
                                </p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button 
                                        onClick={() => updatePostStatus(post.id)}
                                        className={`text-sm flex items-center ${post.status === 'reunited' ? 'text-gray-500' : 'text-green-600 font-medium'}`}
                                    >
                                        {post.status === 'reunited' ? (
                                            <>Marked as Reunited</>
                                        ) : (
                                            <><CheckCircle size={16} className="mr-1" /> Mark as Reunited</>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm('Are you sure you want to delete this report?')) deletePost(post.id);
                                        }}
                                        className="text-sm text-red-500 hover:text-red-700 flex items-center ml-auto"
                                    >
                                        <Trash2 size={16} className="mr-1" /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

        {/* My Pledges */}
        <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Donation Pledges</h2>
            {myPledges.length === 0 ? (
                <p className="text-gray-500 bg-white p-6 rounded-lg shadow">You haven't pledged any donations yet.</p>
            ) : (
                <div className="space-y-4">
                    {myPledges.map(req => (
                        <div key={req.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-green-500">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{req.item}</h3>
                                    <p className="text-sm text-blue-600">{req.rescueName}</p>
                                </div>
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">FULFILLED</span>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 flex items-center">
                                <Package size={16} className="mr-2" />
                                {req.quantity}
                            </div>
                            <button 
                                onClick={() => toggleDonationStatus(req.id, currentUser.id)}
                                className="mt-3 text-sm text-red-500 hover:text-red-700 font-medium flex items-center"
                            >
                                <AlertCircle size={16} className="mr-1" /> Cancel Pledge
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      {/* My Community Posts */}
      <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Community Posts</h2>
            {myEvents.length === 0 ? (
                <p className="text-gray-500 bg-white p-6 rounded-lg shadow">You haven't posted any events or meetups yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myEvents.map(event => (
                        <div key={event.id} className={`bg-white rounded-lg shadow p-4 border-l-4 ${
                            ['Social Meetup', 'Walking Group'].includes(event.type) ? 'border-pink-500' : 'border-purple-500'
                        }`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-gray-900">{event.title}</h3>
                                    <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full text-gray-600">{event.type}</span>
                                </div>
                                <button 
                                    onClick={() => {
                                        if(window.confirm('Are you sure you want to delete this event?')) deleteEvent(event.id);
                                    }}
                                    className="text-red-500 hover:text-red-700 p-1"
                                    title="Delete Post"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="mt-2 space-y-1 text-sm text-gray-600">
                                <div className="flex items-center">
                                    <Calendar size={14} className="mr-2" />
                                    {event.date} • {event.time}
                                </div>
                                <div className="flex items-center">
                                    <MapPin size={14} className="mr-2" />
                                    {event.location}
                                </div>
                                {event.description && (
                                    <p className="text-gray-500 italic mt-2 line-clamp-2">{event.description}</p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>

      {/* My Organizations */}
      <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">My Organizations</h2>
            {myOrganizations.length === 0 ? (
                <p className="text-gray-500 bg-white p-6 rounded-lg shadow">You haven't registered any organizations yet.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {myOrganizations.map(org => (
                        <div key={org.id} className="bg-white rounded-lg shadow p-4 border-l-4 border-blue-500">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-4">
                                    {org.image ? (
                                        <img src={org.image} alt={org.name} className="w-16 h-16 object-cover rounded" />
                                    ) : (
                                        <div className="w-16 h-16 bg-blue-100 rounded flex items-center justify-center text-blue-500">
                                            <Home size={24} />
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="font-bold text-gray-900">{org.name}</h3>
                                        <span className="text-xs font-semibold px-2 py-1 bg-gray-100 rounded-full text-gray-600">{org.category}</span>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <Link 
                                        to={`/edit-org/${org.id}`}
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="Edit Organization"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <button 
                                        onClick={() => {
                                            if(window.confirm('Are you sure you want to delete this organization?')) deleteOrganization(org.id);
                                        }}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Delete Organization"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-600 pl-20">
                                <p>{org.specialty}</p>
                                <p>{org.location}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
}