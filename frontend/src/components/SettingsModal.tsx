import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const { theme, toggleTheme } = useTheme();

    if (!isOpen) return null;

    const handleClearHistory = () => {
        if (confirm('¿Estás seguro de que quieres borrar todo el historial? Esta acción no se puede deshacer.')) {
            // This would need to be implemented with Firestore delete
            toast.success('Historial borrado (funcionalidad pendiente)');
        }
    };

    return (
        <div
            className="fixed inset-0 bg-gray-900/50 dark:bg-gray-900/70 z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
        >
            <div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-6 animate-slide-up"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Ajustes</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Theme Toggle */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                                <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {theme === 'dark' ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                    )}
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Tema</p>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {theme === 'dark' ? 'Modo Oscuro' : 'Modo Claro'}
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={toggleTheme}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${theme === 'dark' ? 'bg-indigo-600' : 'bg-gray-300'
                                }`}
                        >
                            <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                                    }`}
                            />
                        </button>
                    </div>

                    {/* App Info */}
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900 dark:text-white">Información</p>
                            </div>
                        </div>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                            <div className="flex justify-between">
                                <span>Versión:</span>
                                <span className="font-medium">2.0.0</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Modelo:</span>
                                <span className="font-medium">Whisper Small</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Idioma:</span>
                                <span className="font-medium">Español</span>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone */}
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div>
                                <p className="font-medium text-red-900 dark:text-red-200">Zona Peligrosa</p>
                            </div>
                        </div>
                        <button
                            onClick={handleClearHistory}
                            className="w-full px-4 py-2 text-sm font-medium text-red-700 dark:text-red-300 bg-white dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/50 transition-colors"
                        >
                            Borrar Todo el Historial
                        </button>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
