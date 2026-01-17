import React from 'react'
import { Users, Users2, Calendar, Heart, Settings, LogOut } from "lucide-react"
const SideBar = () => {
    return (

        <div className="w-56 bg-[#1B3C53] text-white flex flex-col md:flex">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 border-b border-[#234C6A]">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-blue-900">G</div>
                <span className="text-xl font-bold">Enigma</span>
            </div>

            {/* Menu Items */}
            <nav className="flex-1 px-4 py-6 space-y-2">
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Dashboard</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white">
                    <Users className="w-5 h-5" />
                    <span className="text-sm font-medium">Users</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white">
                    <Calendar className="w-5 h-5" />
                    <span className="text-sm font-medium">Event list</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white">
                    <Users2 className="w-5 h-5" />
                    <span className="text-sm font-medium">Participants</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-medium">Feedback</span>
                </div>
                <div className="flex items-center gap-4 px-4 py-3 rounded-lg transition-colors text-white">
                    <Settings className="w-5 h-5" />
                    <span className="text-sm font-medium">Queries</span>
                </div>
            </nav>

            {/* Logout */}
            <div className="px-4 py-6 border-t border-[#234C6A]">
                <div className="flex items-center gap-4 px-4 py-3 text-blue-100 rounded-lg cursor-pointer transition-colors">
                    <LogOut className="w-5 h-5" />
                    <span className="text-sm font-medium">Log out</span>
                </div>
            </div>
        </div>
    )
}

export default SideBar