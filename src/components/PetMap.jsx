import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default Leaflet icon not finding images
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

// Helper to generate deterministic coordinates from a string/id
const getCoordinates = (post) => {
    // In a real app, this would use post.lat/lng
    // Here we generate stable coordinates based on the post ID to simulate locations
    // Centered around New York City for demo purposes
    
    const hash = post.id.toString().split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    // Use sin to mix it up, ensure it's deterministic
    const seed1 = Math.sin(hash) * 10000;
    const seed2 = Math.cos(hash) * 10000;
    
    const rand1 = seed1 - Math.floor(seed1);
    const rand2 = seed2 - Math.floor(seed2);
    
    // Central Park, NY center
    const centerLat = 40.785091;
    const centerLng = -73.968285;
    
    // Spread within ~0.1 degrees (approx 10km)
    return [
      centerLat + (rand1 - 0.5) * 0.08, 
      centerLng + (rand2 - 0.5) * 0.08
    ];
};

export default function PetMap({ posts }) {
  // Default center (NY)
  const center = [40.785091, -73.968285];

  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden shadow-lg border border-gray-200 z-0">
      <MapContainer 
        center={center} 
        zoom={12} 
        scrollWheelZoom={false} 
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {posts.map(post => {
            const position = getCoordinates(post);
            return (
                <Marker key={post.id} position={position}>
                    <Popup>
                        <div className="min-w-[200px]">
                            <div className="h-32 w-full mb-2 bg-gray-100 rounded overflow-hidden">
                                {post.image ? (
                                    <img src={post.image} alt={post.name} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Photo</div>
                                )}
                            </div>
                            <h3 className="font-bold text-lg">{post.name || 'Unknown Pet'}</h3>
                            <p className="text-sm text-gray-600 mb-1">{post.breed}</p>
                            <div className="flex items-center text-xs text-gray-500 mb-2">
                                <MapPin size={12} className="mr-1" />
                                {post.location}
                            </div>
                            <div className={`text-xs font-bold uppercase inline-block px-2 py-1 rounded text-white mb-2 ${
                                post.status === 'reunited' ? 'bg-green-500' : post.type === 'lost' ? 'bg-red-500' : 'bg-yellow-500'
                            }`}>
                                {post.status === 'reunited' ? 'Reunited' : post.type}
                            </div>
                        </div>
                    </Popup>
                </Marker>
            );
        })}
      </MapContainer>
    </div>
  );
}
