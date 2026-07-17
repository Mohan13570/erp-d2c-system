import React from 'react';
import { Search, Bell, Calendar, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 shrink-0">
      <div className="flex items-center flex-1">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-colors"
            placeholder="Search..."
          />
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <button className="relative text-gray-500 hover:text-gray-700 transition-colors">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>
        
        <button className="text-gray-500 hover:text-gray-700 transition-colors">
          <Calendar className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 border-l border-gray-200 pl-6 cursor-pointer">
          <img
            className="h-8 w-8 rounded-full object-cover"
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
            alt="User avatar"
          />
          <div className="flex items-center">
            <span className="text-sm font-medium text-gray-700">{user?.firstName || 'Mohan'} {user?.lastName || 'G'}</span>
            <ChevronDown className="ml-1 h-4 w-4 text-gray-400" />
          </div>
        </div>
      </div>
    </header>
  );
}
