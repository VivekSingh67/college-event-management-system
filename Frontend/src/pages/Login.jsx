import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';


const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="h-screen bg-[#3d3b50] flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-6xl h-full max-h-200 bg-[#2d2b3e] rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 h-full">
          {/* Left Panel */}
          <div className="hidden md:flex relative bg-linear-to-br from-[#6b5dd3] to-[#8b7ae6] p-6 lg:p-12 flex-col justify-between overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="text-white text-2xl lg:text-3xl font-bold tracking-wider">AMU</div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-3 lg:px-5 py-2 rounded-full text-xs lg:text-sm transition-all flex items-center gap-2">
                Back to website
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            {/* Background Image */}
            <div className="absolute inset-0 opacity-20">
              <img 
                src="data:image/svg+xml,%3Csvg width='800' height='600' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='800' height='600' fill='%23000'/%3E%3C/svg%3E"
                alt="Mountain landscape"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Content */}
            <div className="relative z-10">
              <h2 className="text-white text-2xl lg:text-4xl font-light leading-tight mb-6 lg:mb-8">
                Capturing Moments,<br />Creating Memories
              </h2>
              
              {/* Carousel Dots */}
              <div className="flex gap-2">
                <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                <div className="w-8 h-1 bg-white/40 rounded-full"></div>
                <div className="w-8 h-1 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Right Panel - Form */}
          <div className="p-4 sm:p-6 lg:p-12 flex flex-col justify-center overflow-y-auto">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-white text-2xl sm:text-3xl lg:text-4xl font-normal mb-2">Login account</h1>
              <p className="text-gray-400 text-xs sm:text-sm mb-6 lg:mb-8">
                Don't have an account?{' '}
                <Link to="/" className="text-[#8b7ae6] hover:underline">Sign up</Link>
              </p>

              <div className="space-y-3 sm:space-y-4">

                {/* Email */}
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all"
                  />
                </div>

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all pr-10 sm:pr-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-2 border-gray-600 bg-[#3d3b50] checked:bg-[#8b7ae6] checked:border-[#8b7ae6] focus:outline-none cursor-pointer"
                    />
                    <label htmlFor="remember" className="text-gray-300 text-xs sm:text-sm cursor-pointer">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-[#8b7ae6] hover:underline text-xs sm:text-sm">
                    Forgot password?
                  </a>
                </div>

                {/* Login Button */}
                <button
                  onClick={handleSubmit}
                  className="w-full bg-[#8b7ae6] hover:bg-[#7a69d5] text-white font-medium py-2.5 sm:py-3.5 rounded-lg transition-all shadow-lg mt-4 sm:mt-6 text-sm sm:text-base"
                >
                  Login
                </button>

                {/* Divider */}
                <div className="relative py-4 sm:py-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-[#2d2b3e] px-4 text-gray-400 text-xs sm:text-sm">Or login with</span>
                  </div>
                </div>

                {/* Social Login Buttons */}
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 sm:gap-3 bg-[#3d3b50] hover:bg-[#4d4b60] border border-gray-600 text-white py-2.5 sm:py-3 rounded-lg transition-all text-xs sm:text-base"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="sm:w-5 sm:h-5">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Google
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center gap-2 sm:gap-3 bg-[#3d3b50] hover:bg-[#4d4b60] border border-gray-600 text-white py-2.5 sm:py-3 rounded-lg transition-all text-xs sm:text-base"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="sm:w-5 sm:h-5">
                      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                    </svg>
                    Apple
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;