import { useState } from 'react';
import AudioUploader from './components/AudioUploader';
import TranscriptionViewer from './components/TranscriptionViewer';
import { Layout } from './components/Layout/Layout';
import { useHistory } from './hooks/useHistory';
import { DashboardStats } from './components/Dashboard/Stats';

function App() {
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const { addToHistory } = useHistory();

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setTranscription(null);
    setFilename(file.name);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Use local backend for better performance and no timeouts
      const backendUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:8000/transcribe'  // Local development
        : 'https://mauromaiese1910-audio-transcriber.hf.space/transcribe';  // Production

      const response = await fetch(backendUrl, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Error: ${response.statusText}`);
      }

      const data = await response.json();
      setTranscription(data.transcription);

      // Save to history
      await addToHistory(file.name, data.transcription);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center sm:text-left">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your recordings and create new transcriptions.
            </p>
          </div>
        </div>

        <DashboardStats />

        <div className="bg-white rounded-2xl shadow-sm p-1">
          <AudioUploader onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {transcription && (
          <TranscriptionViewer text={transcription} filename={filename} />
        )}
      </div>
    </Layout>
  );
}

export default App;
