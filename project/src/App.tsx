import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { LoginForm } from './components/auth/LoginForm';
import { RegisterForm } from './components/auth/RegisterForm';
import { OTPVerification } from './components/auth/OTPVerification';
import { HomePage } from './components/user/HomePage';
import { VenuesPage } from './components/user/VenuesPage';
import { VenueDetailPage } from './components/user/VenueDetailPage';
import { BookingPage } from './components/user/BookingPage';
import { MyBookingsPage } from './components/user/MyBookingsPage';
import { ProfilePage } from './components/common/ProfilePage';

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Auto-redirect based on user state and role
    if (user) {
      switch (user.role) {
        case 'user':
          if (currentPage === 'login' || currentPage === 'register' || currentPage === 'verify-otp') {
            setCurrentPage('home');
          }
          break;
        case 'facility_owner':
          if (currentPage === 'login' || currentPage === 'register' || currentPage === 'verify-otp') {
            setCurrentPage('dashboard');
          }
          break;
        case 'admin':
          if (currentPage === 'login' || currentPage === 'register' || currentPage === 'verify-otp') {
            setCurrentPage('dashboard');
          }
          break;
      }
    } else {
      // Redirect to login if trying to access protected pages
      const publicPages = ['home', 'login', 'register', 'verify-otp'];
      if (!publicPages.includes(currentPage)) {
        setCurrentPage('login');
      }
    }
  }, [user, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginForm onNavigate={handleNavigate} />;
      case 'register':
        return <RegisterForm onNavigate={handleNavigate} />;
      case 'verify-otp':
        return <OTPVerification onNavigate={handleNavigate} />;
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'venues':
        return <VenuesPage onNavigate={handleNavigate} />;
      case 'bookings':
        return <MyBookingsPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'dashboard':
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {user?.role === 'facility_owner' ? 'Facility Owner Dashboard' : 'Admin Dashboard'}
              </h2>
              <p className="text-gray-600 mb-6">
                {user?.role === 'facility_owner' 
                  ? 'Manage your facilities and bookings here'
                  : 'Monitor and manage the platform here'
                }
              </p>
              <div className="bg-white rounded-xl shadow-sm p-8 max-w-md mx-auto">
                <p className="text-gray-700">
                  This dashboard is part of the complete QuickCourt implementation. 
                  Key features would include analytics, facility management, and booking oversight.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => handleNavigate('profile')}
                    className="text-blue-600 hover:text-blue-500 font-medium"
                  >
                    View Profile →
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        // Handle venue detail and booking pages
        if (currentPage.startsWith('venue-')) {
          const venueId = currentPage.replace('venue-', '');
          return <VenueDetailPage venueId={venueId} onNavigate={handleNavigate} />;
        }
        if (currentPage.startsWith('booking-')) {
          const venueId = currentPage.replace('booking-', '');
          return <BookingPage venueId={venueId} onNavigate={handleNavigate} />;
        }
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  const showHeader = !['login', 'register', 'verify-otp'].includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      {showHeader && <Header onNavigate={handleNavigate} currentPage={currentPage} />}
      {renderPage()}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;