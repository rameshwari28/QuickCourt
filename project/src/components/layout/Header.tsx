import React, { useState } from 'react';
import { Menu, X, User, LogOut, Home, Calendar, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export const Header: React.FC<HeaderProps> = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const getNavigationItems = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'user':
        return [
          { key: 'home', label: 'Home', icon: Home },
          { key: 'venues', label: 'Venues', icon: Calendar },
          { key: 'bookings', label: 'My Bookings', icon: Calendar }
        ];
      case 'facility_owner':
        return [
          { key: 'dashboard', label: 'Dashboard', icon: Home },
          { key: 'facilities', label: 'Facilities', icon: Calendar },
          { key: 'bookings', label: 'Bookings', icon: Calendar }
        ];
      case 'admin':
        return [
          { key: 'dashboard', label: 'Dashboard', icon: Home },
          { key: 'facilities', label: 'Facilities', icon: Calendar },
          { key: 'users', label: 'Users', icon: User }
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    onNavigate('login');
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => onNavigate(user ? (user.role === 'user' ? 'home' : 'dashboard') : 'home')}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">QC</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">QuickCourt</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          {user && (
            <nav className="hidden md:flex space-x-8">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => onNavigate(key)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    currentPage === key
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-2" />
                  {label}
                </button>
              ))}
            </nav>
          )}

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <img
                    src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                    alt={user.fullName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role.replace('_', ' ')}</p>
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setIsProfileOpen(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="w-4 h-4 mr-3" />
                      Profile Settings
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut className="w-4 h-4 mr-3" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button variant="ghost" onClick={() => onNavigate('login')}>
                  Sign In
                </Button>
                <Button onClick={() => onNavigate('register')}>
                  Sign Up
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && user && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="space-y-2">
              {navigationItems.map(({ key, label, icon: Icon }) => (
                <button
                  key={key}
                  onClick={() => {
                    onNavigate(key);
                    setIsMenuOpen(false);
                  }}
                  className={`flex items-center w-full px-3 py-2 text-sm font-medium transition-colors rounded-lg ${
                    currentPage === key
                      ? 'text-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-4 h-4 mr-3" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};