import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Camera } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface ProfilePageProps {
  onNavigate: (page: string) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
    address: ''
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Please log in</h2>
          <Button onClick={() => onNavigate('login')}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const handleSave = () => {
    // Simulate saving profile
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-600 to-green-600 px-6 py-8">
            <div className="flex items-center">
              <div className="relative">
                <img
                  src={user.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400'}
                  alt={user.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors">
                  <Camera className="w-4 h-4 text-gray-600" />
                </button>
              </div>
              <div className="ml-6 text-white">
                <h2 className="text-2xl font-bold">{user.fullName}</h2>
                <p className="opacity-90 capitalize">{user.role.replace('_', ' ')}</p>
                <p className="opacity-75 text-sm">Member since {user.createdAt.toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
              <Button
                variant={isEditing ? 'secondary' : 'outline'}
                onClick={() => {
                  if (isEditing) {
                    handleSave();
                  } else {
                    setIsEditing(true);
                  }
                }}
              >
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </Button>
            </div>

            <div className="space-y-6">
              <Input
                label="Full Name"
                icon={<User className="w-5 h-5 text-gray-400" />}
                value={formData.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Email Address"
                type="email"
                icon={<Mail className="w-5 h-5 text-gray-400" />}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
              />

              <Input
                label="Phone Number"
                type="tel"
                icon={<Phone className="w-5 h-5 text-gray-400" />}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your phone number"
              />

              <Input
                label="Address"
                icon={<MapPin className="w-5 h-5 text-gray-400" />}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                disabled={!isEditing}
                placeholder="Enter your address"
              />

              {isEditing && (
                <div className="flex space-x-3 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSave}
                    className="flex-1"
                  >
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Account Section */}
          <div className="border-t border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Account Status</span>
                <span className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                  {user.isVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Account Type</span>
                <span className="text-gray-900 font-medium capitalize">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-700">Member Since</span>
                <span className="text-gray-900">
                  {user.createdAt.toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Actions */}
        <div className="mt-6 space-y-3">
          <Button
            variant="outline"
            className="w-full"
            onClick={() => alert('Password change functionality would be implemented here')}
          >
            Change Password
          </Button>
          <Button
            variant="danger"
            className="w-full"
            onClick={() => {
              if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                alert('Account deletion would be handled here');
              }
            }}
          >
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};