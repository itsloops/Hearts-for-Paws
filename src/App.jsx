import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LostAndFound from './pages/LostAndFound';
import RescuesAndFosters from './pages/RescuesAndFosters';
import Donations from './pages/Donations';
import CommunityEvents from './pages/CommunityEvents';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Profile from './pages/Profile';
import EditPost from './pages/EditPost';
import EditEvent from './pages/EditEvent';
import EditOrganization from './pages/EditOrganization';
import Footer from './components/Footer';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />
            <div className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lost-and-found" element={<LostAndFound />} />
                <Route path="/rescues" element={<RescuesAndFosters />} />
                <Route path="/donations" element={<Donations />} />
                <Route path="/events" element={<CommunityEvents />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/edit-post/:id" element={<EditPost />} />
                <Route path="/edit-event/:id" element={<EditEvent />} />
                <Route path="/edit-org/:id" element={<EditOrganization />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
