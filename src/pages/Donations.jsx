import { useState } from 'react';
import { Gift, Package, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';

export default function Donations() {
  const { currentUser } = useAuth();
  const { donationRequests, toggleDonationStatus, organizations } = useData();

  const handleDonate = (id) => {
    if (!currentUser) {
        alert("Please login to pledge a donation.");
        return;
    }
    toggleDonationStatus(id, currentUser.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Donation Wishlists</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Help our rescues by providing the specific items they need right now. 
          Every bag of food, toy, or blanket makes a difference!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {donationRequests.map((req) => (
          <div key={req.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${req.fulfilled ? 'border-green-500' : req.urgency === 'High' ? 'border-red-500' : 'border-blue-500'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{req.item}</h3>
                  <p className="text-sm text-blue-600 font-medium">{req.rescueName}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                  req.fulfilled 
                    ? 'bg-green-100 text-green-800' 
                    : req.urgency === 'High' 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                }`}>
                  {req.fulfilled ? 'Fulfilled' : `${req.urgency} Priority`}
                </div>
              </div>

              <p className="text-gray-600 mb-4 text-sm">{req.description}</p>
              
              <div className="flex items-center text-sm text-gray-500 mb-6">
                <Package className="w-4 h-4 mr-2" />
                <span>Needed: {req.quantity}</span>
              </div>

              <button
                onClick={() => handleDonate(req.id)}
                disabled={req.fulfilled && req.pledgedBy !== currentUser?.id}
                className={`w-full flex items-center justify-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  req.fulfilled
                    ? req.pledgedBy === currentUser?.id
                        ? 'bg-red-100 text-red-600 hover:bg-red-200'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-md'
                }`}
              >
                {req.fulfilled ? (
                    req.pledgedBy === currentUser?.id ? (
                        <>
                            <AlertCircle className="w-4 h-4 mr-2" />
                            Cancel Pledge
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Fulfilled
                        </>
                    )
                ) : (
                  <>
                    <Gift className="w-4 h-4 mr-2" />
                    I Can Donate This
                  </>
                )}
              </button>
              
              {organizations.find(o => o.id === req.orgId)?.amazonWishlist && (
                  <a 
                    href={organizations.find(o => o.id === req.orgId).amazonWishlist}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block mt-3 text-center text-xs text-gray-500 hover:text-orange-600 hover:underline flex items-center justify-center gap-1"
                  >
                    or view their Amazon Wishlist
                  </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
