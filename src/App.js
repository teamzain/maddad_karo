import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './Pages/Homepage';
import NavigationBar from './components/Navbar';
import Loginpage from './Pages/Loginpage';
import RecieverDashboardPage from './Pages/RecieverDashboardPage'; // You'll need to create this component
import FundraisPage from './Pages/FundraisPage';
import Profilepage from './Pages/Profilepage';
import DonationPage from './Pages/DonationPage';
import { isPrimaryPointer } from 'framer-motion';
import Footer from './components/footer';
import RequestDetailPage from './Pages/RequestDetailPage';
import ContactPage from './Pages/ContactUspage';
import AboutPage from './Pages/AboutPage';
import GalleryPage from './Pages/GalleryPage';
import SignupPage from './Pages/SignupPage';
import AdminDashboard from './Pages/AdminDashboard';
const App = () => {
  return (
    <Router>
      <div>
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/dashboard" element={<RecieverDashboardPage />} />
          <Route path="/request-funds" element={<FundraisPage />} />
          <Route path="/profile" element={<Profilepage />} />
          <Route path="/donate" element={<DonationPage />} />
          <Route path="/request-detail/:id" element={<RequestDetailPage />} />
          <Route path="/contact-us" element={<ContactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/register" element={<SignupPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          {/* Add more routes as needed */}
        </Routes>
        <Footer />
      </div>
    </Router>
  );
};

export default App;