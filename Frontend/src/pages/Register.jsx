import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Link } from 'react-router-dom';

const SignupForm = () => {
  const [step, setStep] = useState(1); // 1 = first step, 2 = second step
  const [showPassword, setShowPassword] = useState(false);

  const nextStep = () => {
    setStep(2);
  };

  const prevStep = () => {
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#3d3b50] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl bg-[#2d2b3e] rounded-3xl shadow-2xl overflow-hidden">
        <div className="grid md:grid-cols-2 min-h-150">
          {/* Left decorative panel - unchanged */}
          <div className="relative bg-linear-to-br from-[#6b5dd3] to-[#8b7ae6] p-12 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="text-white text-3xl font-bold tracking-wider">AMU</div>
              <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-5 py-2 rounded-full text-sm transition-all flex items-center gap-2">
                Back to website
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>

            <div className="absolute inset-0 opacity-20 pointer-events-none">
              <img
                src="https://images.unsplash.com/photo-1506905925346-21bda5367436?auto=format&fit=crop&w=800&q=80"
                alt="Mountain landscape"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="relative z-10">
              <h2 className="text-white text-4xl font-light leading-tight mb-8">
                Capturing Moments,<br />Creating Memories
              </h2>
              <div className="flex gap-2">
                <div className={`w-8 h-1 rounded-full transition-all ${step === 1 ? 'bg-white' : 'bg-white/40'}`}></div>
                <div className={`w-8 h-1 rounded-full transition-all ${step === 2 ? 'bg-white' : 'bg-white/40'}`}></div>
              </div>
            </div>
          </div>

          {/* Right side - Form */}
          <div className="p-12 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <h1 className="text-white text-4xl font-normal mb-2">Create an account</h1>
              <p className="text-gray-400 text-sm mb-8">
                Already have an account?{' '}
                <Link to="/login" className="text-[#8b7ae6] hover:underline">Log in</Link>
              </p>

              <div className="space-y-4">
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="text"
                        placeholder="First name"
                        className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all"
                      />
                      <input
                        type="text"
                        placeholder="Last name"
                        className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all"
                      />
                    </div>

                    <input
                      type="email"
                      placeholder="Email"
                      className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all"
                    />

                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 cursor-pointer"
                      >
                        {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                      </button>
                    </div>

                    {/* Next Button */}
                    <button
                      type="button"
                      onClick={nextStep}
                      className="w-full bg-[#8b7ae6] hover:bg-[#7a69d5] text-white font-medium py-3.5 rounded-lg transition-all shadow-lg mt-6"
                    >
                      Next
                    </button>
                  </>
                )}

                {/* Step 2: Additional Info */}
                {step === 2 && (
                  <>
                    <input
                      type="tel"
                      placeholder="Mobile Number (e.g. 9876543210)"
                      className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[#8b7ae6] transition-all"
                    />

                    <select
                      className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8b7ae6] transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Department / Faculty</option>
                      <option value="engineering">Engineering & Technology</option>
                      <option value="science">Science</option>
                      <option value="arts">Arts</option>
                      <option value="commerce">Commerce</option>
                      <option value="law">Law</option>
                      <option value="medicine">Medicine</option>
                      <option value="management">Management Studies</option>
                      <option value="social-sciences">Social Sciences</option>
                      <option value="agricultural">Agricultural Sciences</option>
                      <option value="life-sciences">Life Sciences</option>
                      <option value="theology">Theology</option>
                    </select>

                    <select
                      className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8b7ae6] transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>Select Branch</option>
                      <option value="cse">Computer Science & Engineering</option>
                      <option value="ece">Electronics & Communication</option>
                      <option value="me">Mechanical Engineering</option>
                      <option value="ee">Electrical Engineering</option>
                      <option value="civil">Civil Engineering</option>
                      <option value="it">Information Technology</option>
                      <option value="other">Other / Non-Technical</option>
                    </select>

                    <select
                      className="w-full bg-[#3d3b50] border border-gray-600 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#8b7ae6] transition-all"
                      defaultValue=""
                    >
                      <option value="" disabled>Year of Study / Joining Year</option>
                      <option value="1">1st Year</option>
                      <option value="2">2nd Year</option>
                      <option value="3">3rd Year</option>
                      <option value="4">4th Year</option>
                      <option value="5">5th Year (Integrated)</option>
                      <option value="passed">Already Passed Out (Alumni)</option>
                    </select>

                    {/* Terms checkbox */}
                    <div className="flex items-start gap-3 pt-2">
                      <input
                        type="checkbox"
                        id="terms"
                        defaultChecked
                        className="mt-1 w-5 h-5 rounded border-2 border-gray-600 bg-[#3d3b50] checked:bg-[#8b7ae6] checked:border-[#8b7ae6] focus:outline-none cursor-pointer"
                      />
                      <label htmlFor="terms" className="text-gray-300 text-sm cursor-pointer">
                        I agree to the{' '}
                        <a href="#" className="text-[#8b7ae6] hover:underline">
                          Terms & Conditions
                        </a>
                      </label>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <button
                        type="button"
                        onClick={prevStep}
                        className="flex-1 bg-[#3d3b50] hover:bg-[#4d4b60] text-white font-medium py-3.5 rounded-lg transition-all"
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        className="flex-1 bg-[#8b7ae6] hover:bg-[#7a69d5] text-white font-medium py-3.5 rounded-lg transition-all shadow-lg"
                      >
                        Create account
                      </button>
                    </div>
                  </>
                )}

                {/* Social Login - Only show on first step (optional) */}
                {step === 1 && (
                  <>
                    <div className="relative py-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-600"></div>
                      </div>
                      <div className="relative flex justify-center">
                        <span className="bg-[#2d2b3e] px-4 text-gray-400 text-sm">Or register with</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="flex items-center justify-center gap-3 bg-[#3d3b50] hover:bg-[#4d4b60] border border-gray-600 text-white py-3 rounded-lg transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Google
                      </button>

                      <button className="flex items-center justify-center gap-3 bg-[#3d3b50] hover:bg-[#4d4b60] border border-gray-600 text-white py-3 rounded-lg transition-all">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                        </svg>
                        Apple
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;