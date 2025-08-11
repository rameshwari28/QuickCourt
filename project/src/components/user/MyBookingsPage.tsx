import React, { useState } from 'react';
import { Calendar, MapPin, Clock, CreditCard, X } from 'lucide-react';
import { format, isPast, parseISO } from 'date-fns';
import { Button } from '../ui/Button';
import { mockBookings } from '../../data/mockData';

interface MyBookingsPageProps {
  onNavigate: (page: string) => void;
}

export const MyBookingsPage: React.FC<MyBookingsPageProps> = ({ onNavigate }) => {
  const [filter, setFilter] = useState('all');
  
  const filteredBookings = mockBookings.filter(booking => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return !isPast(parseISO(`${booking.date}T${booking.startTime}`));
    if (filter === 'past') return isPast(parseISO(`${booking.date}T${booking.startTime}`));
    return booking.status === filter;
  });

  const handleCancelBooking = (bookingId: string) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      // Simulate cancellation
      alert('Booking cancelled successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">My Bookings</h1>
          
          {/* Filter Tabs */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            {[
              { key: 'all', label: 'All Bookings' },
              { key: 'upcoming', label: 'Upcoming' },
              { key: 'past', label: 'Past' },
              { key: 'confirmed', label: 'Confirmed' },
              { key: 'cancelled', label: 'Cancelled' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  filter === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Bookings List */}
        <div className="space-y-4">
          {filteredBookings.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
              <p className="text-gray-600 mb-4">Start booking your favorite sports venues!</p>
              <Button onClick={() => onNavigate('venues')}>
                Browse Venues
              </Button>
            </div>
          ) : (
            filteredBookings.map((booking) => {
              const isUpcoming = !isPast(parseISO(`${booking.date}T${booking.startTime}`));
              const canCancel = isUpcoming && booking.status === 'confirmed';

              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">
                          {booking.venueName}
                        </h3>
                        <p className="text-gray-600">{booking.courtName} - {booking.sportType}</p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </span>
                        {canCancel && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancelBooking(booking.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {format(parseISO(booking.date), 'MMM dd, yyyy')}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <CreditCard className="w-4 h-4 mr-2" />
                        <span className="text-sm font-medium">
                          ${booking.totalAmount}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-gray-600">
                        <span className={`text-sm font-medium ${
                          isUpcoming ? 'text-green-600' : 'text-gray-500'
                        }`}>
                          {isUpcoming ? 'Upcoming' : 'Past'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {booking.status === 'confirmed' && isUpcoming && (
                    <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
                      <p className="text-sm text-blue-800">
                        🎯 Your booking is confirmed! Please arrive 10 minutes early.
                      </p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};