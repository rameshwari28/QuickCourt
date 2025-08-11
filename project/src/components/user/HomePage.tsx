import React from 'react';
import { MapPin, Star, Clock, Users, TrendingUp } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { mockVenues } from '../../data/mockData';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  
  const popularSports = ['Badminton', 'Tennis', 'Football', 'Basketball'];
  const featuredVenues = mockVenues.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-green-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to QuickCourt
              {user && (
                <span className="block text-2xl md:text-3xl font-normal mt-2 opacity-90">
                  Hi, {user.fullName}!
                </span>
              )}
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Book your favorite sports venues in seconds
            </p>
            <Button
              size="lg"
              className="bg-white text-blue-600 hover:bg-gray-100"
              onClick={() => onNavigate('venues')}
            >
              Explore Venues
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">50+</div>
            <div className="text-gray-600">Venues</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">1000+</div>
            <div className="text-gray-600">Users</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Clock className="w-6 h-6 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">5000+</div>
            <div className="text-gray-600">Bookings</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">4.8</div>
            <div className="text-gray-600">Rating</div>
          </div>
        </div>

        {/* Popular Sports */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Popular Sports</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {popularSports.map((sport, index) => (
              <div
                key={sport}
                className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                onClick={() => onNavigate('venues')}
              >
                <div className={`w-16 h-16 rounded-lg flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform ${
                  index === 0 ? 'bg-blue-100' :
                  index === 1 ? 'bg-green-100' :
                  index === 2 ? 'bg-orange-100' : 'bg-purple-100'
                }`}>
                  <span className="text-2xl">🏸</span>
                </div>
                <h3 className="font-semibold text-gray-900 text-center">{sport}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Venues */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Featured Venues</h2>
            <Button variant="outline" onClick={() => onNavigate('venues')}>
              View All Venues
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredVenues.map((venue) => (
              <div
                key={venue.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => onNavigate(`venue-${venue.id}`)}
              >
                <div className="relative overflow-hidden rounded-t-xl">
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white px-2 py-1 rounded-full text-sm font-medium">
                      ${venue.pricePerHour}/hr
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{venue.name}</h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{venue.description}</p>
                  <div className="flex items-center mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{venue.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{venue.rating}</span>
                      <span className="text-sm text-gray-600 ml-1">({venue.reviewCount})</span>
                    </div>
                    <div className="flex space-x-1">
                      {venue.sportsTypes.slice(0, 2).map((sport) => (
                        <span
                          key={sport}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {sport}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};