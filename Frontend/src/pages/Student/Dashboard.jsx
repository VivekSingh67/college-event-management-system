import React from 'react'
import { Users, Users2, Calendar, Shield } from "lucide-react"
import SideBar from '../../components/SideBar'
import Header from '../../components/Header'

const Dashboard = () => {
    return (
        <div className='flex h-screen bg-gray-50'>
            <SideBar />
            {/* Main Content */}
            <div className="flex-1 flex flex-col w-full">

                <Header />

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

export default Dashboard