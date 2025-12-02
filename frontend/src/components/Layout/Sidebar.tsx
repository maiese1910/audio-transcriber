import React, { useState } from 'react';
import { useHistory } from '../../hooks/useHistory';
import { SettingsModal } from '../SettingsModal';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    userId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, userId }) => {
    const { history, loading } = useHistory(userId);
    const [showSettings, setShowSettings] = useState(false);

    return (
        <>
            {/* Mobile overlay */}
            <div
                className={`fixed inset-0 bg-gray-900/50 z-40 lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 bottom-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 transform transition-all duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100 dark:border-gray-700">
                        <div className="h-8 w-8 mr-3 bg-white rounded-lg p-1 flex items-center justify-center">
                            <img src="/logo.png" alt="Transcriber" className="h-full w-full object-contain" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                            Transcriber
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 mb-2">
                            <h3 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                                Recent Transcriptions
                            </h3>
                        </div>
                        <nav className="space-y-1 px-2">
                            {loading ? (
                                <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">Loading...</div>
                            ) : history.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-400 dark:text-gray-500">No history yet</div>
                            ) : (
                                history.map((item) => (
                                    <a
                                        key={item.id}
                                        href="#"
                                        className="group flex flex-col px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                    >
                                        <span className="truncate">{item.filename}</span>
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-normal">
                                            {item.date.toLocaleDateString()}
                                        </span>
                                    </a>
                                ))
                            )}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            onClick={() => setShowSettings(true)}
                            className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-3 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>
                    </div>
                </div>
            </div>

            <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
        </>
    );
};
