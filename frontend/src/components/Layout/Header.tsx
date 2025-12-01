import React from 'react';
import type { User } from 'firebase/auth';

interface HeaderProps {
    onMenuClick: () => void;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, user, onLogin, onLogout }) => {
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
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900">{user.displayName}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                            </button>
                            {/* Dropdown for logout */}
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Cerrar Sesión
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={onLogin}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z" />
                        </svg>
                        Iniciar con Google
                    </button>
                )}
            </div>
        </header>
    );
};
