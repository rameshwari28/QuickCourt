import React, { useState, useEffect } from 'react';
import { Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';

interface OTPVerificationProps {
  onNavigate: (page: string) => void;
}

export const OTPVerification: React.FC<OTPVerificationProps> = ({ onNavigate }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const { verifyOTP, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    const success = await verifyOTP(otpString);
    if (success) {
      onNavigate('home');
    } else {
      setError('Invalid OTP. Use 123456 for demo.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">Verify your email</h2>
          <p className="mt-2 text-gray-600">Enter the 6-digit code sent to your email</p>
        </div>

        {/* Demo info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <p className="text-sm text-blue-800">
            <strong>Demo OTP:</strong> 123456
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-sm text-red-600 text-center">{error}</p>
              </div>
            )}

            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              ))}
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Verify Email
            </Button>
          </div>

          <div className="text-center">
            <p className="text-gray-600">
              Didn't receive the code?{' '}
              <button
                type="button"
                className="text-blue-600 hover:text-blue-500 font-medium"
              >
                Resend
              </button>
            </p>
            <button
              type="button"
              onClick={() => onNavigate('register')}
              className="mt-2 text-gray-600 hover:text-gray-500"
            >
              ← Back to registration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};