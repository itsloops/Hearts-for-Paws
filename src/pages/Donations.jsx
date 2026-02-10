import { useState, useEffect } from 'react';
import { Gift, Package, AlertCircle, CheckCircle, Filter, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { useLocation, Link } from 'react-router-dom';

export default function Donations() {
  const { currentUser } = useAuth();
  const { donationRequests, toggleDonationStatus, organizations } = useData();
  const location = useLocation();
  const [filterOrgId, setFilterOrgId] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const orgId = params.get('orgId');
    if (orgId) {
        setFilterOrgId(orgId);
    }
  }, [location]);

  const filteredRequests = filterOrgId 
    ? donationRequests.filter(req => req.orgId === filterOrgId.toString())
    : donationRequests;

  const activeOrg = filterOrgId ? organizations.find(o => o.id.toString() === filterOrgId.toString()) : null;

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

      {activeOrg && (
          <div className="mb-8 bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                  <Filter className="text-blue-600" />
                  <span className="font-medium text-blue-900">
                      Showing wishlist for <span className="font-bold">{activeOrg.name}</span>
                  </span>
              </div>
              <button 
                onClick={() => setFilterOrgId(null)}
                className="text-blue-600 hover:text-blue-800 text-sm font-bold flex items-center gap-1"
              >
                  <X size={16} /> Clear Filter
              </button>
          </div>
      )}

      {filteredRequests.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Gift className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No active requests found</h3>
              <p className="text-gray-500">
                  {activeOrg ? "This organization hasn't added any wishlist items yet." : "Check back later for new donation opportunities."}
              </p>
          </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRequests.map((req) => (
            <div key={req.id} className={`bg-white rounded-lg shadow-md overflow-hidden border-l-4 ${req.fulfilled ? 'border-green-500' : req.urgency === 'Critical' ? 'border-red-600' : req.urgency === 'High' ? 'border-red-400' : 'border-blue-500'}`}>
                <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                    <h3 className="text-lg font-bold text-gray-900">{req.item}</h3>
                    <p className="text-sm text-blue-600 font-medium">{req.rescueName}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                    req.fulfilled 
                        ? 'bg-green-100 text-green-800' 
                        : req.urgency === 'Critical'
                        ? 'bg-red-200 text-red-900 animate-pulse'
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
                
                {organizations.find(o => String(o.id) === String(req.orgId))?.amazonWishlist && (
                    <a 
                        href={organizations.find(o => String(o.id) === String(req.orgId)).amazonWishlist}
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
      )}
    </div>
  );
}
