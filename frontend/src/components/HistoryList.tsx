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
            <div className="text-center p-8 text-gray-500">
                No hay historial de transcripciones aún.
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Historial Reciente</h3>
            </div>
            <ul className="divide-y divide-gray-100">
                {history.map((item) => (
                    <li
                        key={item.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => onSelect(item.text, item.filename)}
                    >
                        <div className="px-6 py-4">
                            <div className="flex items-center justify-between mb-1">
                                <p className="text-sm font-medium text-indigo-600 truncate">
                                    {item.filename}
                                </p>
                                <p className="text-xs text-gray-500">
                                    {item.date.toLocaleDateString()}
                                </p>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2">
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
