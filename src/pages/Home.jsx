import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MapPin, Calendar, ArrowRight, Heart, AlertCircle, Home as HomeIcon, Image as ImageIcon } from 'lucide-react';

export default function Home() {
  const { posts, events, organizations } = useData();

  // Get recent active lost pets (limit 3)
  const recentLostPets = posts
    .filter(post => post.status === 'lost')
    .slice(0, 3);

  // Get upcoming events (limit 3)
  const upcomingEvents = [...events]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Get featured rescues (limit 3)
  const featuredRescues = organizations.slice(0, 3);

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6">Hearts for Paws 🐾</h1>
          <p className="text-xl mb-8 text-blue-100">
            Connecting pets with loving homes, reuniting families, and building a stronger animal welfare community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/lost-and-found"
              className="bg-white text-blue-600 px-8 py-3 rounded-full font-bold hover:bg-blue-50 transition shadow-lg flex items-center justify-center gap-2"
            >
              <AlertCircle size={20} />
              I Lost a Pet
            </Link>
            <Link
              to="/lost-and-found"
              className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition shadow-lg flex items-center justify-center gap-2"
            >
              <Heart size={20} />
              I Found a Pet
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        
        {/* Recent Lost Pets Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Recent Lost Pets</h2>
            <Link to="/lost-and-found" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              View All <ArrowRight size={16} />
            </Link>
          </div>
          
          {recentLostPets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentLostPets.map(post => (
                <div key={post.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    {post.image ? (
                        <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center text-gray-400">
                            <ImageIcon size={48} />
                            <span className="text-sm mt-2 font-medium">No Photo</span>
                        </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-lg text-gray-900">{post.name}</h3>
                    <p className="text-gray-500 text-sm mb-2">{post.breed}</p>
                    <div className="flex items-center text-gray-500 text-sm">
                      <MapPin size={14} className="mr-1" />
                      {post.location}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl text-center text-gray-500">
              No recent lost pets reported. That's good news!
            </div>
          )}
        </section>

        {/* Upcoming Events Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Events</h2>
            <Link to="/events" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
              View Calendar <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingEvents.map(event => (
              <div key={event.id} className="bg-white rounded-xl p-6 shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
                <div className="text-purple-600 font-bold mb-2 text-sm uppercase tracking-wide">
                  {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-4">
                  <MapPin size={14} className="mr-1" />
                  {event.location}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Rescues Section */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Featured Organizations</h2>
            <Link to="/rescues" className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
              Browse Directory <ArrowRight size={16} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredRescues.map(org => (
              <Link key={org.id} to="/rescues" className="group block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-all">
                <div className="flex items-center p-4">
                  {org.image ? (
                    <img src={org.image} alt={org.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 mr-4">
                        <HomeIcon size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{org.name}</h3>
                    <p className="text-sm text-gray-500">{org.specialty}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
