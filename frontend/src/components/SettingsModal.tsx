import React, { useState, useEffect } from 'react';
import { Button } from './ui/Button';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (apiKey: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave }) => {
    const [apiKey, setApiKey] = useState('');

    useEffect(() => {
        const storedKey = localStorage.getItem('openai_api_key');
        if (storedKey) setApiKey(storedKey);
    }, [isOpen]);

    const handleSave = () => {
        onSave(apiKey);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>

                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        OpenAI API Key
                    </label>
                    <input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="sk-..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                        Your key is stored locally in your browser. It is never sent to our servers.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave}>
                        Save Key
                    </Button>
                </div>
            </div>
        </div>
    );
};
