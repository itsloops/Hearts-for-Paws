import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Link, Navigate } from 'react-router-dom';
import { MapPin, Calendar, CheckCircle, Package, AlertCircle, Trash2, Users, Image as ImageIcon, Home, Edit, MessageSquare, Mail, LayoutDashboard } from 'lucide-react';

export default function Profile() {
  const { currentUser, logout } = useAuth();
  const { 
    posts, 
    updatePostStatus, 
    deletePost,
    donationRequests, 
    toggleDonationStatus,
    events,
    deleteEvent,
    organizations,
    deleteOrganization,
    getMessagesForUser,
    markMessageAsRead
  } = useData();

  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' or 'messages'

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  const myPosts = posts.filter(post => post.userId === currentUser.id);
  const myPledges = donationRequests.filter(req => req.pledgedBy === currentUser.id);
  const myEvents = events.filter(event => event.userId === currentUser.id);
  const myOrganizations = organizations.filter(org => org.userId === currentUser.id);
  const myMessages = getMessagesForUser ? getMessagesForUser(currentUser.id).sort((a, b) => new Date(b.date) - new Date(a.date)) : [];
  const unreadCount = myMessages.filter(m => !m.read).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div className="flex items-center space-x-4">
                <div className="bg-blue-100 p-4 rounded-full">
                    <span className="text-2xl font-bold text-blue-600">{currentUser.name.charAt(0).toUpperCase()}</span>
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{currentUser.name}</h1>
                    <p className="text-gray-600">{currentUser.email}</p>
                </div>
            </div>
            <div className="flex gap-3 ml-auto">
                <Link to="/org-dashboard" className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition shadow-md">
                    <Home size={18} />
                    Manage Organization
                </Link>
                <button onClick={logout} className="flex items-center gap-2 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition">
                  <Users size={18} />
                  Logout
                </button>
            </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-6 border-b border-gray-100">
            <button 
                onClick={() => setActiveTab('dashboard')}
                className={`pb-3 px-1 font-medium text-sm flex items-center gap-2 transition-colors relative ${
                    activeTab === 'dashboard' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <LayoutDashboard size={18} />
                Dashboard
                {activeTab === 'dashboard' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
            </button>
            <button 
                onClick={() => setActiveTab('messages')}
                className={`pb-3 px-1 font-medium text-sm flex items-center gap-2 transition-colors relative ${
                    activeTab === 'messages' ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'
                }`}
            >
                <MessageSquare size={18} />
                Messages
                {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full min-w-[1.25rem] h-5 px-1 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
                {activeTab === 'messages' && <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 rounded-full"></span>}
            </button>
        </div>
      </div>

      {activeTab === 'messages' ? (
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Mail className="text-blue-600" />
                    Inbox
                </h2>
            </div>
            
            {myMessages.length === 0 ? (
                <div className="text-center py-16 px-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <MessageSquare className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">No messages yet</h3>
                    <p className="text-gray-500">Messages from other users regarding your pets will appear here.</p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {myMessages.map(msg => (
                        <div 
                           key={msg.id} 
                           className={`p-6 hover:bg-gray-50 transition cursor-pointer ${!msg.read ? 'bg-blue-50/40' : ''}`}
                           onClick={() => markMessageAsRead(msg.id)}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {!msg.read && <span className="w-2 h-2 rounded-full bg-blue-600"></span>}
                                    <h3 className={`text-lg ${!msg.read ? 'font-bold text-gray-900' : 'font-medium text-gray-800'}`}>
                                        {msg.subject}
                                    </h3>
                                </div>
                                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                    {new Date(msg.date).toLocaleDateString()} {new Date(msg.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-3 font-medium flex items-center gap-1">
                                <Users size={14} />
                                {msg.senderName}
                            </p>
                            <div className="bg-white p-4 rounded-lg border border-gray-200 text-gray-700 leading-relaxed text-sm">
                                {msg.content}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      ) : (
        <div className="space-y-8">
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                                    <div className="flex items-center gap-2 ml-auto">
                                        <Link 
                                            to={`/edit-post/${post.id}`}
                                            className="text-sm text-blue-500 hover:text-blue-700 flex items-center"
                                        >
                                            <Edit size={16} className="mr-1" /> Edit
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                if(window.confirm('Are you sure you want to delete this report?')) deletePost(post.id);
                                            }}
                                            className="text-sm text-red-500 hover:text-red-700 flex items-center"
                                        >
                                            <Trash2 size={16} className="mr-1" /> Delete
                                        </button>
                                    </div>
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
                                <div className="flex items-center gap-2">
                                    <Link 
                                        to={`/edit-event/${event.id}`}
                                        className="text-blue-500 hover:text-blue-700 p-1"
                                        title="Edit Post"
                                    >
                                        <Edit size={18} />
                                    </Link>
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
        </div>
      )}
    </div>
  );
}