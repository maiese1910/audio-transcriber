import React from 'react';

interface TranscriptionViewerProps {
    text: string;
    filename: string;
}

const TranscriptionViewer: React.FC<TranscriptionViewerProps> = ({ text, filename }) => {
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
    };

    const handleDownloadWord = () => {
        // Create HTML content that Word can open
        const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>${filename}</title>
        </head>
        <body>
          <h1>Transcripción: ${filename}</h1>
          <p>${text.replace(/\n/g, '</p><p>')}</p>
        </body>
      </html>
    `;

        const blob = new Blob([htmlContent], { type: 'application/msword' });
        const url = URL.createObjectURL(blob);
        const element = document.createElement("a");
        element.href = url;
        element.download = `${filename.replace(/\.[^/.]+$/, '')}_transcription.doc`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-colors duration-200">
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 dark:text-white">Resultado de la Transcripción</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">{filename}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleCopy}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 rounded-lg transition-all duration-200 border border-transparent hover:border-indigo-100 dark:hover:border-indigo-800"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 012-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copiar
                    </button>
                    <button
                        onClick={handleDownloadWord}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Descargar Word
                    </button>
                </div>
            </div>
            <div className="p-8 bg-white dark:bg-gray-800">
                <div className="prose max-w-none">
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-200 leading-loose text-lg font-light">
                        {text}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TranscriptionViewer;
