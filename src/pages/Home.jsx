import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MapPin, Calendar, ArrowRight, Heart, AlertCircle, Home as HomeIcon, Image as ImageIcon, Users, Gift, Star } from 'lucide-react';

export default function Home() {
  const { posts, events, organizations } = useData();

  const meetupTypes = ['Social Meetup', 'Walking Group'];

  // Calculate "Rescue of the Month" deterministically based on the current month
  const currentMonthIndex = new Date().getMonth();
  const rescueOfTheMonth = organizations.length > 0 
    ? organizations[currentMonthIndex % organizations.length] 
    : null;

  // Get recent active lost pets (limit 3)
  const recentLostPets = posts
    .filter(post => post.status === 'lost')
    .slice(0, 3);

  // Get success stories (reunited pets)
  const successStories = posts
    .filter(post => post.status === 'reunited')
    .slice(0, 3);

  // Get upcoming OFFICIAL events (limit 3)
  const upcomingEvents = [...events]
    .filter(event => !meetupTypes.includes(event.type))
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  // Get upcoming MEETUPS (limit 3)
  const upcomingMeetups = [...events]
    .filter(event => meetupTypes.includes(event.type))
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
        
        {/* Rescue of the Month - Featured Section */}
        {rescueOfTheMonth && (
          <section className="mb-16 bg-white rounded-2xl shadow-xl overflow-hidden border border-amber-100 relative">
            <div className="absolute top-0 right-0 bg-amber-400 text-white px-6 py-2 rounded-bl-2xl font-bold flex items-center gap-2 shadow-sm z-10">
              <Star className="fill-current" size={20} />
              Rescue of the Month
            </div>
            
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/3 h-64 md:h-auto relative bg-gray-100 flex items-center justify-center">
                {rescueOfTheMonth.image ? (
                  <img src={rescueOfTheMonth.image} alt={rescueOfTheMonth.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <HomeIcon size={64} />
                    <span className="text-sm mt-2 font-medium">No Photo Available</span>
                  </div>
                )}
              </div>
              
              <div className="p-8 md:w-2/3 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-amber-600 font-bold uppercase tracking-wider text-sm mb-2">
                  <Star size={16} />
                  Featured Organization
                </div>
                
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{rescueOfTheMonth.name}</h2>
                <div className="flex items-center text-gray-500 mb-4">
                  <MapPin size={18} className="mr-1" />
                  {rescueOfTheMonth.address || 'Location not specified'}
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3">
                  {rescueOfTheMonth.description || "Dedicated to helping animals find their forever homes. Support this organization by donating or adopting today!"}
                </p>
                
                <div className="flex flex-wrap gap-4">
                   <Link 
                     to="/rescues" 
                     className="bg-gray-900 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-800 transition shadow-md flex items-center gap-2"
                   >
                     View Profile
                     <ArrowRight size={18} />
                   </Link>
                   
                   {rescueOfTheMonth.amazonWishlist && (
                     <a 
                       href={rescueOfTheMonth.amazonWishlist} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="bg-amber-100 text-amber-800 px-6 py-3 rounded-lg font-bold hover:bg-amber-200 transition flex items-center gap-2"
                     >
                       <Gift size={18} />
                       Send a Gift
                     </a>
                   )}
                </div>
              </div>
            </div>
          </section>
        )}

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
                <Link to={`/lost-and-found/${post.id}`} key={post.id} className="block bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow">
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
                </Link>
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
            <h2 className="text-2xl font-bold text-gray-800">Community Events</h2>
            <Link to="/events?tab=events" className="text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1">
              View Calendar <ArrowRight size={16} />
            </Link>
          </div>

          {upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingEvents.map(event => (
                <Link to="/events?tab=events" key={event.id} className="block bg-white rounded-xl p-6 shadow-sm border border-purple-100 hover:border-purple-200 transition-colors">
                  <div className="text-purple-600 font-bold mb-2 text-sm uppercase tracking-wide">
                    {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{event.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    {event.location}
                  </div>
                  <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                </Link>
              ))}
            </div>
          ) : (
             <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-dashed border-gray-300">
               No upcoming official events scheduled.
             </div>
          )}
        </section>

        {/* Upcoming Meetups Section */}
        <section className="mb-16">
          <div className="flex justify-between items-end mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Upcoming Meetups</h2>
            <Link to="/events?tab=meetups" className="text-pink-600 hover:text-pink-700 font-medium flex items-center gap-1">
              Join a Meetup <ArrowRight size={16} />
            </Link>
          </div>

          {upcomingMeetups.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingMeetups.map(meetup => (
                <Link to="/events?tab=meetups" key={meetup.id} className="block bg-white rounded-xl p-6 shadow-sm border border-pink-100 hover:border-pink-200 transition-colors relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-pink-50 text-pink-600 px-3 py-1 rounded-bl-lg text-xs font-bold uppercase">
                    {meetup.type}
                  </div>
                  <div className="text-pink-600 font-bold mb-2 text-sm uppercase tracking-wide flex items-center gap-2">
                    <Calendar size={14} />
                    {new Date(meetup.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{meetup.title}</h3>
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <MapPin size={14} className="mr-1" />
                    {meetup.location}
                  </div>
                  
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                    <div className="flex items-center text-gray-500 text-xs">
                        <Users size={14} className="mr-1" />
                        {meetup.attendees?.length || 0} going
                    </div>
                    <span className="text-pink-600 text-sm font-medium hover:underline">View Details</span>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl text-center text-gray-500 border border-dashed border-gray-300">
              No upcoming meetups scheduled. Be the first to host one!
            </div>
          )}
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
