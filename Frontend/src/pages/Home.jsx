import React from 'react'
import { Menu, Search, ChevronDown, Users, Users2, Calendar, Shield } from "lucide-react"
import SideBar from '../components/SideBar'

const Home = () => {
    return (
        <div className='flex h-screen bg-gray-50'>
            <SideBar />
            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full">
                {/* Header */}
                <div className="bg-white border-b border-gray-200 px-6 py-4">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button className="md:hidden">
                                <Menu className="w-6 h-6 text-gray-700" />
                            </button>
                            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                        </div>

                        {/* Search Bar */}
                        <div className="hidden sm:flex flex-1 max-w-md">
                            <div className="flex items-center w-full bg-gray-50 rounded-lg border border-gray-200">
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="flex-1 bg-transparent px-4 py-2 outline-none text-sm"
                                />
                                <button className="bg-[#234C6A]  text-white px-4 py-2 rounded-r-lg transition-colors">
                                    <Search className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* User Profile */}
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                <Users className="w-5 h-5 text-gray-600" />
                            </div>
                            <div className="hidden sm:flex items-center gap-1">
                                <span className="text-sm font-medium text-gray-900">vijai@mit.edu</span>
                                <ChevronDown className="w-4 h-4 text-gray-500" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="flex-1 p-6 overflow-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
                                    <div className="flex items-center gap-1 mt-3 text-teal-600">
                                        <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                                        <span className="text-xs font-medium">Up to date</span>
                                    </div>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-400`}>
                                    <Users className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Participants</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                                    <div className="flex items-center gap-1 mt-3 text-teal-600">
                                        <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                                        <span className="text-xs font-medium">Up to date</span>
                                    </div>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-blue-400`}>
                                    <Users2 className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Events</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">1</p>
                                    <div className="flex items-center gap-1 mt-3 text-teal-600">
                                        <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                                        <span className="text-xs font-medium">Up to date</span>
                                    </div>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-yellow-400`}>
                                    <Calendar className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-sm">
                            <div className="flex items-start justify-between">
                                <div>
                                    <p className="text-gray-600 text-sm font-medium">Total Admins</p>
                                    <p className="text-3xl font-bold text-gray-900 mt-2">0</p>
                                    <div className="flex items-center gap-1 mt-3 text-teal-600">
                                        <div className="w-4 h-4 rounded-full bg-teal-100 flex items-center justify-center text-xs">✓</div>
                                        <span className="text-xs font-medium">Up to date</span>
                                    </div>
                                </div>
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center bg-pink-400`}>
                                    <Shield className="w-8 h-8 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home