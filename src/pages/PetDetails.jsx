import { useParams, Link, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { MapPin, Calendar, CheckCircle, Phone, Mail, ArrowLeft, Share2, AlertTriangle } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Reusing the icon fix from PetMap
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function PetDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { posts } = useData();
  
  const post = posts.find(p => p.id.toString() === id);

  if (!post) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Pet Not Found</h2>
        <p className="text-gray-600 mb-8">The pet you are looking for has been removed or does not exist.</p>
        <Link to="/lost-and-found" className="text-blue-600 hover:text-blue-800 font-medium">
          &larr; Back to Lost & Found
        </Link>
      </div>
    );
  }

  // Mock coordinates logic (same as PetMap for consistency)
  const getCoordinates = (post) => {
    const hash = post.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const seed1 = Math.sin(hash) * 10000;
    const seed2 = Math.cos(hash) * 10000;
    const rand1 = seed1 - Math.floor(seed1);
    const rand2 = seed2 - Math.floor(seed2);
    const centerLat = 40.785091;
    const centerLng = -73.968285;
    return [centerLat + (rand1 - 0.5) * 0.08, centerLng + (rand2 - 0.5) * 0.08];
  };

  const position = getCoordinates(post);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Help find ${post.name}`,
        text: `Check out this ${post.type} pet on Hearts for Paws: ${post.name}`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" /> Back
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Image Section */}
          <div className="h-96 lg:h-auto bg-gray-100 relative">
            {post.image ? (
              <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <AlertTriangle size={64} />
                <span className="mt-4 text-lg font-medium">No Photo Available</span>
              </div>
            )}
            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-md text-sm font-bold uppercase text-white tracking-wide shadow-sm ${
                post.status === 'reunited' ? 'bg-green-500' : post.type === 'lost' ? 'bg-red-500' : 'bg-yellow-500'
            }`}>
                {post.status === 'reunited' ? 'Reunited' : post.type}
            </div>
          </div>

          {/* Details Section */}
          <div className="p-8 lg:p-12 flex flex-col h-full">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">{post.name || 'Unknown Pet'}</h1>
                <p className="text-xl text-gray-600">{post.breed}</p>
              </div>
              <button 
                onClick={handleShare}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition-colors"
                title="Share this post"
              >
                <Share2 size={24} />
              </button>
            </div>

            <div className="space-y-6 flex-grow">
              <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-4 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2" />
                  Description
                </h3>
                <p className="text-blue-800 leading-relaxed">
                  {post.description || "No additional details provided."}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    <MapPin className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Last Seen Location</span>
                    <span className="block text-lg font-semibold text-gray-900">{post.location}</span>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-3 rounded-lg mr-4">
                    <Calendar className="w-6 h-6 text-gray-600" />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-gray-500">Date Reported</span>
                    <span className="block text-lg font-semibold text-gray-900">{post.date}</span>
                  </div>
                </div>
              </div>

              {/* Map Preview */}
              <div className="h-48 w-full rounded-xl overflow-hidden border border-gray-200 shadow-sm relative z-0">
                <MapContainer 
                    center={position} 
                    zoom={13} 
                    scrollWheelZoom={false} 
                    style={{ height: "100%", width: "100%" }}
                    zoomControl={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={position} />
                </MapContainer>
              </div>

              {/* Contact Info */}
              <div className="border-t border-gray-100 pt-8 mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h3>
                <div className="flex flex-col sm:flex-row gap-4">
                    {post.contactEmail && (
                        <a href={`mailto:${post.contactEmail}`} className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2 shadow-sm">
                            <Mail size={20} />
                            Email Owner
                        </a>
                    )}
                    {post.contactPhone && (
                        <a href={`tel:${post.contactPhone}`} className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition font-medium flex items-center justify-center gap-2 shadow-sm">
                            <Phone size={20} />
                            Call Owner
                        </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
