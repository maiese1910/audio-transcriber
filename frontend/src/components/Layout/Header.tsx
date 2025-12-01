import React from 'react';
import type { User } from 'firebase/auth';
import { useTheme } from '../../context/ThemeContext';

interface HeaderProps {
    onMenuClick: () => void;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, user, onLogin, onLogout }) => {
    const { theme, toggleTheme } = useTheme();

    return (
        <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 h-16 flex items-center px-6 justify-between lg:justify-end transition-colors duration-200">
            {/* Mobile menu button */}
            <button
                onClick={onMenuClick}
                className="lg:hidden p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
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

            {/* Right section */}
            <div className="flex items-center space-x-4">
                {/* Theme Toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 focus:outline-none transition-colors"
                    aria-label="Toggle Dark Mode"
                >
                    {theme === 'light' ? (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    )}
                </button>

                {/* User section */}
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{user.displayName}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
                        </div>
                        <div className="relative group">
                            <button className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-center text-white font-semibold">
                                {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                            </button>
                            {/* Dropdown for logout */}
                            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 border border-gray-100 dark:border-gray-700">
                                <button
                                    onClick={onLogout}
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
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
