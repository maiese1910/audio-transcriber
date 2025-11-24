import React from 'react';

interface HeaderProps {
    onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
    return (
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-6 justify-between lg:justify-end">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Logo for mobile */}
            <div className="flex items-center lg:hidden">
                <img src="/logo.png" alt="Transcriber" className="h-8 w-8 mr-2" />
                <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                    Transcriber
                </span>
            </div>

            {/* User section */}
            <div className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                    U
                </div>
            </div>
        </header>
    );
};
