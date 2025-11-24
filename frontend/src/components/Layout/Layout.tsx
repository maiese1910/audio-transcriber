import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex-1 flex flex-col lg:pl-64 transition-all duration-300">
                <Header onMenuClick={() => setSidebarOpen(true)} />

                <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
                    <div className="max-w-5xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
};
