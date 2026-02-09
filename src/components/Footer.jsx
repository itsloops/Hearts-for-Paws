import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, Facebook, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center text-white font-bold text-xl mb-4">
              <Heart className="h-6 w-6 mr-2 text-pink-500 fill-current" />
              <span>Hearts for Paws</span>
            </div>
            <p className="text-gray-400 text-sm">
              Connecting pets with loving homes and building a stronger animal welfare community since 2026.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition-colors">Home</Link></li>
              <li><Link to="/lost-and-found" className="hover:text-white transition-colors">Lost & Found</Link></li>
              <li><Link to="/rescues" className="hover:text-white transition-colors">Rescues & Fosters</Link></li>
              <li><Link to="/events" className="hover:text-white transition-colors">Community Events</Link></li>
              <li><Link to="/donations" className="hover:text-white transition-colors">Donations</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
                <Link to="/contact" className="hover:text-blue-400 transition-colors">Contact Us</Link>
            </h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li className="flex items-center">
                <Mail size={16} className="mr-2" />
                info@heartsforpaws.net
              </li>
              <li className="mt-4">
                <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline">Send us a message</Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-blue-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Hearts for Paws. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-500 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
