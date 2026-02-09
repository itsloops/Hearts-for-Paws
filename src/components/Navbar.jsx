import { Link } from 'react-router-dom';
import { Heart, Search, Home, Gift, Calendar, LogIn, LogOut, User, Mail, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { currentUser, logout } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-blue-600 font-bold text-xl">
              <img 
                src="/logo.png" 
                alt="Hearts for Paws Logo" 
                className="h-10 w-auto mr-2" 
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src='/logo.svg'; 
                }} 
              />
              <span className="hidden sm:inline">Hearts for Paws</span>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link to="/lost-and-found" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
              <Search className="w-4 h-4 mr-1" />
              Lost & Found
            </Link>
            <Link to="/rescues" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
              <Heart className="w-4 h-4 mr-1" />
              Rescues & Fosters
            </Link>
            <Link to="/donations" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
              <Gift className="w-4 h-4 mr-1" />
              Wishlists
            </Link>
            <Link to="/events" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
              <Calendar className="w-4 h-4 mr-1" />
              Community
            </Link>
            <Link to="/contact" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
              <Mail className="w-4 h-4 mr-1" />
              Contact
            </Link>
            
            {currentUser ? (
                <div className="flex items-center gap-4 ml-4 pl-4 border-l border-gray-200">
                    <Link to="/profile" className="text-sm text-gray-600 hover:text-blue-600 flex items-center font-medium">
                        <User className="w-4 h-4 mr-1" />
                        {currentUser.name}
                    </Link>
                    <button 
                        onClick={logout}
                        className="text-gray-600 hover:text-red-600 flex items-center px-3 py-2 rounded-md text-sm font-medium"
                    >
                        <LogOut className="w-4 h-4 mr-1" />
                        Logout
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 ml-4 pl-4 border-l border-gray-200">
                    <Link to="/login" className="text-gray-600 hover:text-blue-600 flex items-center px-3 py-2 rounded-md text-sm font-medium">
                        <LogIn className="w-4 h-4 mr-1" />
                        Login
                    </Link>
                    <Link to="/signup" className="bg-blue-600 text-white hover:bg-blue-700 px-4 py-2 rounded-md text-sm font-medium transition-colors">
                        Sign Up
                    </Link>
                </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
