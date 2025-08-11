import React, { useState } from 'react';
import { MapPin, Star, Clock, Wifi, Car, Coffee, ShowerHead as Shower, User, Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { mockVenues, mockCourts } from '../../data/mockData';

interface VenueDetailPageProps {
  venueId: string;
  onNavigate: (page: string) => void;
}

export const VenueDetailPage: React.FC<VenueDetailPageProps> = ({ venueId, onNavigate }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  const venue = mockVenues.find(v => v.id === venueId);
  const venueCourts = mockCourts.filter(c => c.venueId === venueId);

  if (!venue) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Venue not found</h2>
          <Button onClick={() => onNavigate('venues')}>Back to Venues</Button>
        </div>
      </div>
    );
  }

  const amenityIcons: { [key: string]: React.ReactNode } = {
    'Parking': <Car className="w-5 h-5" />,
    'Locker Rooms': <User className="w-5 h-5" />,
    'Cafeteria': <Coffee className="w-5 h-5" />,
    'AC': <Clock className="w-5 h-5" />,
    'Shower': <Shower className="w-5 h-5" />,
    'WiFi': <Wifi className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate('venues')}
            className="text-blue-600 hover:text-blue-500 mb-4"
          >
            ← Back to Venues
          </button>
          
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{venue.name}</h1>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{venue.address}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400 mr-1" />
                  <span className="font-medium">{venue.rating}</span>
                  <span className="text-gray-600 ml-1">({venue.reviewCount} reviews)</span>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  ${venue.pricePerHour}/hr
                </div>
              </div>
            </div>
            <Button 
              size="lg"
              onClick={() => onNavigate(`booking-${venue.id}`)}
              className="lg:px-8"
            >
              Book Now
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div>
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="relative">
                <img
                  src={venue.images[selectedImageIndex]}
                  alt={`${venue.name} - Image ${selectedImageIndex + 1}`}
                  className="w-full h-96 object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex space-x-2 overflow-x-auto">
                  {venue.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? 'border-blue-500'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${venue.name} thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Venue Details */}
          <div className="space-y-6">
            {/* Description */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">About This Venue</h2>
              <p className="text-gray-600 leading-relaxed">{venue.description}</p>
            </div>

            {/* Sports Available */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Sports Available</h2>
              <div className="flex flex-wrap gap-3">
                {venue.sportsTypes.map((sport) => (
                  <div
                    key={sport}
                    className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-lg"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {sport}
                  </div>
                ))}
              </div>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 gap-3">
                {venue.amenities.map((amenity) => (
                  <div
                    key={amenity}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    {amenityIcons[amenity] || <Clock className="w-5 h-5" />}
                    <span className="ml-3 text-gray-700">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Courts */}
            {venueCourts.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Available Courts</h2>
                <div className="space-y-3">
                  {venueCourts.map((court) => (
                    <div
                      key={court.id}
                      className="flex justify-between items-center p-4 border border-gray-200 rounded-lg"
                    >
                      <div>
                        <h3 className="font-semibold text-gray-900">{court.name}</h3>
                        <p className="text-sm text-gray-600">{court.sportType}</p>
                        <p className="text-xs text-gray-500">
                          {court.operatingHours.start} - {court.operatingHours.end}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          ${court.pricePerHour}/hr
                        </div>
                        <div className={`text-xs px-2 py-1 rounded-full ${
                          court.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {court.isActive ? 'Available' : 'Closed'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Reviews</h2>
          <div className="space-y-6">
            {/* Sample Reviews */}
            {[
              {
                name: 'Alice Johnson',
                rating: 5,
                comment: 'Excellent facility with great amenities. Courts are well-maintained and staff is friendly.',
                date: '2 days ago'
              },
              {
                name: 'Bob Smith',
                rating: 4,
                comment: 'Good value for money. Booking was easy and the court was available exactly when needed.',
                date: '1 week ago'
              }
            ].map((review, index) => (
              <div key={index} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.name}</h4>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{review.date}</span>
                </div>
                <p className="text-gray-700 ml-13">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};