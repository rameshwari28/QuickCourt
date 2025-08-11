import { Venue, Court, Booking } from '../types';

export const mockVenues: Venue[] = [
  {
    id: '1',
    name: 'Elite Sports Complex',
    description: 'Premium sports facility with state-of-the-art equipment and professional courts.',
    address: '123 Sports Avenue, Downtown',
    sportsTypes: ['Badminton', 'Tennis', 'Squash'],
    amenities: ['Parking', 'Locker Rooms', 'Cafeteria', 'AC', 'Shower'],
    images: [
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.8,
    reviewCount: 124,
    pricePerHour: 25,
    ownerId: '2',
    isApproved: true,
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'City Sports Hub',
    description: 'Affordable community sports center with multiple courts and friendly atmosphere.',
    address: '456 Community Road, Midtown',
    sportsTypes: ['Football', 'Basketball', 'Volleyball'],
    amenities: ['Parking', 'Locker Rooms', 'Water Station'],
    images: [
      'https://images.pexels.com/photos/1080721/pexels-photo-1080721.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.2,
    reviewCount: 89,
    pricePerHour: 18,
    ownerId: '2',
    isApproved: true,
    createdAt: new Date('2024-02-01')
  },
  {
    id: '3',
    name: 'Premier Tennis Club',
    description: 'Exclusive tennis facility with professional coaching and tournament-grade courts.',
    address: '789 Tennis Lane, Uptown',
    sportsTypes: ['Tennis'],
    amenities: ['Parking', 'Pro Shop', 'Coaching', 'Locker Rooms', 'Restaurant'],
    images: [
      'https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=800',
      'https://images.pexels.com/photos/863988/pexels-photo-863988.jpeg?auto=compress&cs=tinysrgb&w=800'
    ],
    rating: 4.9,
    reviewCount: 156,
    pricePerHour: 35,
    ownerId: '2',
    isApproved: true,
    createdAt: new Date('2024-01-20')
  }
];

export const mockCourts: Court[] = [
  {
    id: '1',
    venueId: '1',
    name: 'Court A',
    sportType: 'Badminton',
    pricePerHour: 25,
    operatingHours: { start: '06:00', end: '23:00' },
    isActive: true
  },
  {
    id: '2',
    venueId: '1',
    name: 'Court B',
    sportType: 'Tennis',
    pricePerHour: 30,
    operatingHours: { start: '06:00', end: '23:00' },
    isActive: true
  },
  {
    id: '3',
    venueId: '2',
    name: 'Field 1',
    sportType: 'Football',
    pricePerHour: 18,
    operatingHours: { start: '07:00', end: '22:00' },
    isActive: true
  }
];

export const mockBookings: Booking[] = [
  {
    id: '1',
    userId: '1',
    venueId: '1',
    courtId: '1',
    date: '2025-01-20',
    startTime: '10:00',
    endTime: '11:00',
    totalAmount: 25,
    status: 'confirmed',
    createdAt: new Date('2025-01-15'),
    userName: 'John Doe',
    venueName: 'Elite Sports Complex',
    courtName: 'Court A',
    sportType: 'Badminton'
  },
  {
    id: '2',
    userId: '1',
    venueId: '2',
    courtId: '3',
    date: '2025-01-18',
    startTime: '15:00',
    endTime: '16:00',
    totalAmount: 18,
    status: 'completed',
    createdAt: new Date('2025-01-10'),
    userName: 'John Doe',
    venueName: 'City Sports Hub',
    courtName: 'Field 1',
    sportType: 'Football'
  }
];

export const generateTimeSlots = (startHour: number = 6, endHour: number = 23): string[] => {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    slots.push(`${hour.toString().padStart(2, '0')}:00`);
    slots.push(`${hour.toString().padStart(2, '0')}:30`);
  }
  return slots;
};