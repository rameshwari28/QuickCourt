import React, { useState } from 'react';
import { Search, Filter, MapPin, Star, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { mockVenues } from '../../data/mockData';

interface VenuesPageProps {
  onNavigate: (page: string) => void;
}

export const VenuesPage: React.FC<VenuesPageProps> = ({ onNavigate }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSport, setSelectedSport] = useState('');
  const [sortBy, setSortBy] = useState('rating');

  const allSports = Array.from(new Set(mockVenues.flatMap(v => v.sportsTypes)));
  
  const filteredVenues = mockVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = !selectedSport || venue.sportsTypes.includes(selectedSport);
    return matchesSearch && matchesSport;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return a.pricePerHour - b.pricePerHour;
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Venues</h1>
          
          {/* Search and Filters */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search venues or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  icon={<Search className="w-5 h-5 text-gray-400" />}
                />
              </div>
              
              <div>
                <select
                  value={selectedSport}
                  onChange={(e) => setSelectedSport(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Sports</option>
                  {allSports.map(sport => (
                    <option key={sport} value={sport}>{sport}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="rating">Rating</option>
                  <option value="price">Price</option>
                  <option value="name">Name</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-gray-600">
            Found {filteredVenues.length} venue{filteredVenues.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Venues Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVenues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer group"
              onClick={() => onNavigate(`venue-${venue.id}`)}
            >
              <div className="flex">
                <div className="relative w-48 flex-shrink-0">
                  <img
                    src={venue.images[0]}
                    alt={venue.name}
                    className="w-full h-full object-cover rounded-l-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <div className="bg-white px-3 py-1 rounded-full text-sm font-semibold">
                      ${venue.pricePerHour}/hr
                    </div>
                  </div>
                </div>
                
                <div className="flex-1 p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-900">{venue.name}</h3>
                    <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{venue.description}</p>
                  
                  <div className="flex items-center mb-3">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-600">{venue.address}</span>
                  </div>
                  
                  <div className="flex items-center mb-4">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({venue.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-4">
                    {venue.sportsTypes.map((sport) => (
                      <span
                        key={sport}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {sport}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex flex-wrap gap-1">
                    {venue.amenities.slice(0, 3).map((amenity) => (
                      <span
                        key={amenity}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {amenity}
                      </span>
                    ))}
                    {venue.amenities.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{venue.amenities.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No venues found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};