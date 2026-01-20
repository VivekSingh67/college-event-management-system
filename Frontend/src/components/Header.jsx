import React from 'react'
import { Menu, Search, ChevronDown, Users } from "lucide-react"
const Header = () => {
    return (
        <div>
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
        </div>
    )
}

export default Header