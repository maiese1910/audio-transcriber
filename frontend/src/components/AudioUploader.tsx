import React, { useState, useCallback } from 'react';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onUpload, isUploading }) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  }, [onUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative group cursor-pointer p-12 border-3 border-dashed rounded-2xl transition-all duration-300 ease-in-out transform hover:scale-[1.01] ${dragActive
        ? 'border-blue-500 bg-blue-50 shadow-lg scale-[1.02]'
        : 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-gray-100'
        }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
        onChange={handleChange}
        accept="audio/*"
        disabled={isUploading}
      />
      <div className="text-center space-y-4">
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-6">
            {/* Loading Spinner */}
            <div className="relative">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            </div>

            <div className="space-y-2">
              <p className="text-xl font-bold text-gray-700">Transcribiendo audio...</p>
              <p className="text-sm text-gray-500">
                Esto puede tardar unos momentos dependiendo del tamaño del archivo.
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="mx-auto h-20 w-20 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors duration-300">
              <svg className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div>
              <p className="text-xl font-bold text-gray-700 mb-1 group-hover:text-blue-700 transition-colors">
                Arrastra y suelta tu archivo de audio aquí
              </p>
              <p className="text-base text-gray-500">
                o <span className="text-blue-600 font-medium underline decoration-blue-300 hover:decoration-blue-600 transition-all">explorar archivos</span>
              </p>
            </div>
            <div className="flex items-center justify-center gap-4 mt-4">
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">MP3</span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">WAV</span>
              <span className="px-3 py-1 bg-gray-200 rounded-full text-xs font-medium text-gray-600">M4A</span>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Formatos soportados: MP3, WAV, M4A, MP4, MPEG, MPGA (hasta 50 MB)
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default AudioUploader;
