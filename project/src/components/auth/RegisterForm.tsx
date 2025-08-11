import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface RegisterFormProps {
  onNavigate: (page: string) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'user' as 'user' | 'facility_owner'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { register, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = await register({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
      role: formData.role
    });

    if (success) {
      onNavigate('verify-otp');
    } else {
      setError('Email already exists or registration failed');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-2xl">QC</span>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Create account</h2>
          <p className="mt-2 text-gray-600">Join QuickCourt today</p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}

            <Input
              label="Full name"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleInputChange('fullName', e.target.value)}
              icon={<User className="w-5 h-5 text-gray-400" />}
              required
            />

            <Input
              label="Email address"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              icon={<Mail className="w-5 h-5 text-gray-400" />}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Account Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'user')}
                  className={`p-3 rounded-lg border transition-colors text-center ${
                    formData.role === 'user'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">User</div>
                  <div className="text-xs">Book courts</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('role', 'facility_owner')}
                  className={`p-3 rounded-lg border transition-colors text-center ${
                    formData.role === 'facility_owner'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">Owner</div>
                  <div className="text-xs">Manage facilities</div>
                </button>
              </div>
            </div>

            <div className="relative">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                icon={<Lock className="w-5 h-5 text-gray-400" />}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            <Input
              label="Confirm password"
              type={showPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              icon={<Lock className="w-5 h-5 text-gray-400" />}
              required
            />

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Create Account
            </Button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};