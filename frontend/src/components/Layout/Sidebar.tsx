import React from 'react';
import { useHistory } from '../../hooks/useHistory';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
    const { history, loading } = useHistory();

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
                className={`fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-gray-200 z-50 transform transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-gray-100">
                        <img src="/logo.png" alt="Transcriber" className="h-8 w-8 mr-3" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                            Transcriber
                        </span>
                    </div>

                    <div className="flex-1 overflow-y-auto py-4">
                        <div className="px-4 mb-2">
                            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                Recent Transcriptions
                            </h3>
                        </div>
                        <nav className="space-y-1 px-2">
                            {loading ? (
                                <div className="px-3 py-2 text-sm text-gray-400">Loading...</div>
                            ) : history.length === 0 ? (
                                <div className="px-3 py-2 text-sm text-gray-400">No history yet</div>
                            ) : (
                                history.map((item) => (
                                    <a
                                        key={item.id}
                                        href="#"
                                        className="group flex flex-col px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    >
                                        <span className="truncate">{item.filename}</span>
                                        <span className="text-xs text-gray-400 font-normal">
                                            {item.date.toLocaleDateString()}
                                        </span>
                                    </a>
                                ))
                            )}
                        </nav>
                    </div>

                    <div className="p-4 border-t border-gray-100">
                        <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            Settings
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
