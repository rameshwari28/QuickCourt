import React, { useState } from 'react';
import { Calendar, Clock, CreditCard, MapPin, Star } from 'lucide-react';
import { format, addDays } from 'date-fns';
import { Button } from '../ui/Button';
import { mockVenues, mockCourts, generateTimeSlots } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';

interface BookingPageProps {
  venueId: string;
  onNavigate: (page: string) => void;
}

export const BookingPage: React.FC<BookingPageProps> = ({ venueId, onNavigate }) => {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [selectedCourt, setSelectedCourt] = useState('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  const [duration, setDuration] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  const venue = mockVenues.find(v => v.id === venueId);
  const venueCourts = mockCourts.filter(c => c.venueId === venueId);
  const selectedCourtData = venueCourts.find(c => c.id === selectedCourt);

  const next7Days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(new Date(), i);
    return {
      date: format(date, 'yyyy-MM-dd'),
      display: format(date, 'MMM dd'),
      day: format(date, 'EEE')
    };
  });

  const timeSlots = generateTimeSlots(6, 23);
  const totalAmount = selectedCourtData ? selectedCourtData.pricePerHour * duration : 0;

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

  const handleBooking = async () => {
    setIsBooking(true);
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simulate successful booking
    setIsBooking(false);
    
    // Show success message and redirect
    alert('Booking confirmed! Redirecting to your bookings...');
    onNavigate('bookings');
  };

  const canBook = selectedDate && selectedCourt && selectedTimeSlot && user;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => onNavigate(`venue-${venueId}`)}
            className="text-blue-600 hover:text-blue-500 mb-4"
          >
            ← Back to Venue Details
          </button>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-start justify-between">
              <div className="flex">
                <img
                  src={venue.images[0]}
                  alt={venue.name}
                  className="w-24 h-20 object-cover rounded-lg mr-4"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">{venue.name}</h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{venue.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-sm font-medium">{venue.rating}</span>
                    <span className="text-sm text-gray-600 ml-1">({venue.reviewCount})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Select Date
              </h2>
              <div className="grid grid-cols-7 gap-2">
                {next7Days.map(({ date, display, day }) => (
                  <button
                    key={date}
                    onClick={() => setSelectedDate(date)}
                    className={`p-3 text-center rounded-lg transition-colors ${
                      selectedDate === date
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="text-xs font-medium">{day}</div>
                    <div className="text-sm">{display}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Court Selection */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Select Court</h2>
              <div className="space-y-3">
                {venueCourts.map((court) => (
                  <button
                    key={court.id}
                    onClick={() => setSelectedCourt(court.id)}
                    className={`w-full p-4 text-left rounded-lg border transition-colors ${
                      selectedCourt === court.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-gray-900">{court.name}</h3>
                        <p className="text-sm text-gray-600">{court.sportType}</p>
                        <p className="text-xs text-gray-500">
                          Available: {court.operatingHours.start} - {court.operatingHours.end}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-blue-600">
                          ${court.pricePerHour}/hr
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Selection */}
            {selectedCourt && (
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2" />
                  Select Time
                </h2>
                <div className="grid grid-cols-4 md:grid-cols-6 gap-2 mb-4">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTimeSlot(time)}
                      className={`p-2 text-sm rounded-lg transition-colors ${
                        selectedTimeSlot === time
                          ? 'bg-blue-600 text-white'
                          : Math.random() > 0.7
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                      }`}
                      disabled={Math.random() > 0.7}
                    >
                      {time}
                    </button>
                  ))}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours)
                  </label>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {[1, 2, 3, 4].map((hrs) => (
                      <option key={hrs} value={hrs}>
                        {hrs} hour{hrs > 1 ? 's' : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {selectedDate ? format(new Date(selectedDate), 'MMM dd, yyyy') : 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Court:</span>
                  <span className="font-medium">
                    {selectedCourtData ? selectedCourtData.name : 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">
                    {selectedTimeSlot || 'Not selected'}
                  </span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{duration} hour{duration > 1 ? 's' : ''}</span>
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Price per hour:</span>
                    <span>${selectedCourtData?.pricePerHour || 0}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Total:</span>
                    <span className="text-blue-600">${totalAmount}</span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleBooking}
                disabled={!canBook}
                isLoading={isBooking}
                className="w-full"
                size="lg"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                {isBooking ? 'Processing...' : 'Book & Pay'}
              </Button>
              
              {!user && (
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Please log in to complete your booking
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};