import React from "react";
import { Mail, Lock, User, ArrowRight } from "lucide-react";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

          <div className="bg-[#1B3C53] px-8 py-6 relative overflow-hidden">

            <div className="absolute inset-0 opacity-10 bg-[#1B3C53] pointer-events-none" />

            <div className="relative flex flex-col items-center text-center">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center font-bold text-[#1B3C53] text-2xl shadow-md">
                  G
                </div>
                <span className="text-3xl font-bold text-white tracking-tight">Enigma</span>
              </div>
              <p className="text-blue-100/90 text-sm max-w-xs">
                Join Enigma and start your secure journey today
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="px-8 pt-8 pb-10">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/40 focus:border-[#1B3C53] text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    placeholder="yourname@example.com"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/40 focus:border-[#1B3C53] text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/40 focus:border-[#1B3C53] text-sm transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    placeholder="Confirm your password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B3C53]/40 focus:border-[#1B3C53] text-sm transition-all"
                  />
                </div>
              </div>
            </div>

            <button className="w-full bg-[#1B3C53] hover:bg-[#142e42] text-white font-medium py-3.5 rounded-lg mt-8 transition-all flex items-center justify-center gap-2 shadow-md active:scale-[0.98]">
              Create Account
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;