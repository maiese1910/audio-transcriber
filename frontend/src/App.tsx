import { useState, useEffect } from 'react';
import AudioUploader from './components/AudioUploader';
import TranscriptionViewer from './components/TranscriptionViewer';
import { Layout } from './components/Layout/Layout';
import { useHistory } from './hooks/useHistory';
import { DashboardStats } from './components/Dashboard/Stats';
import Login from './components/Login';
import HistoryList from './components/HistoryList';
import { auth } from './firebase';
import { onAuthStateChanged, type User, signOut } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Pass userId to useHistory hook
  const { history, loading: historyLoading, addToHistory } = useHistory(user?.uid);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
        ? 'http://localhost:7860/transcribe'  // Local development
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

  const handleHistorySelect = (text: string, fname: string) => {
    setTranscription(text);
    setFilename(fname);
    // Scroll to top to see the viewer
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignOut = () => {
    signOut(auth);
    setTranscription(null);
    setFilename("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Bienvenido, {user.displayName}
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="text-sm text-gray-500 hover:text-gray-700 underline"
          >
            Cerrar Sesión
          </button>
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

        <div className="mt-12">
          <HistoryList
            history={history}
            loading={historyLoading}
            onSelect={handleHistorySelect}
          />
        </div>
      </div>
    </Layout>
  );
}

export default App;
