import { Card } from '../ui/Card';

export const DashboardStats = () => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white border-none">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-indigo-100 text-sm font-medium">Total Transcriptions</p>
                        <h3 className="text-3xl font-bold mt-1">12</h3>
                    </div>
                    <div className="p-3 bg-white/20 rounded-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                        </svg>
                    </div>
                </div>
            </Card>

            <Card className="bg-white border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Hours Saved</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">4.5</h3>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                </div>
            </Card>

            <Card className="bg-white border-gray-200">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-gray-500 text-sm font-medium">Storage Used</p>
                        <h3 className="text-3xl font-bold text-gray-900 mt-1">128 MB</h3>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                        <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                        </svg>
                    </div>
                </div>
            </Card>
        </div>
    );
};
