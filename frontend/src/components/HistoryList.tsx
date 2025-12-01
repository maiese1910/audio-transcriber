import React from 'react';
import type { TranscriptionItem } from '../hooks/useHistory';

interface HistoryListProps {
    history: TranscriptionItem[];
    loading: boolean;
    onSelect: (text: string, filename: string) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, loading, onSelect }) => {
    if (loading) {
        return (
            <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (history.length === 0) {
        return (
            <div className="text-center p-8 text-gray-500 dark:text-gray-400">
                No hay historial de transcripciones aún.
            </div>
        );
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm overflow-hidden transition-colors duration-200">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Historial Reciente</h3>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-gray-700">
                {history.map((item) => (
                    <li
                        key={item.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                        onClick={() => onSelect(item.text, item.filename)}
                    >
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-indigo-600 dark:text-indigo-400 truncate">
                                    {item.filename}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {item.date.toLocaleDateString()}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                                {item.text}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default HistoryList;
