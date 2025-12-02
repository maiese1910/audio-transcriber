import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import type { User } from 'firebase/auth';

interface LayoutProps {
    children: React.ReactNode;
    user: User | null;
    onLogin: () => void;
    onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogin, onLogout }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex transition-colors duration-200">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} userId={user?.uid} />

            <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
                <Header
                    onMenuClick={() => setSidebarOpen(true)}
                    user={user}
                    onLogin={onLogin}
                    onLogout={onLogout}
                />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
