import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import AudioUploader from './components/AudioUploader';
import TranscriptionViewer from './components/TranscriptionViewer';
import { Layout } from './components/Layout/Layout';
import { useHistory } from './hooks/useHistory';
import { DashboardStats } from './components/Dashboard/Stats';
import HistoryList from './components/HistoryList';
import { auth } from './firebase';
import { onAuthStateChanged, type User, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [segments, setSegments] = useState<any[]>([]); // Store segments for SRT export
  const [filename, setFilename] = useState<string>("");

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
    setTranscription(null);
    setSegments([]);
    setFilename(file.name);

    const formData = new FormData();
    formData.append('file', file);

    const uploadPromise = async () => {
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
      return data;
    };

    try {
      const data = await uploadPromise();

      setTranscription(data.transcription);
      setSegments(data.segments || []); // Store segments

      if (user) {
        await addToHistory(file.name, data.transcription);
      }

      toast.success('¡Transcripción completada con éxito!');
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? `Error: ${err.message}` : 'Ocurrió un error desconocido');
    } finally {
      setIsUploading(false);
    }
  };

  const handleHistorySelect = (text: string, fname: string) => {
    setTranscription(text);
    setFilename(fname);
    setSegments([]); // History currently doesn't save segments, so clear them
    // Scroll to top to see the viewer
    window.scrollTo({ top: 0, behavior: 'smooth' });
    toast.success('Transcripción cargada del historial');
  };

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast.success('Sesión iniciada correctamente');
    } catch (err: any) {
      console.error("Login error:", err);
      const errorMessage = err.code ? `Error: ${err.code}` : err.message;
      toast.error(errorMessage || "Error al iniciar sesión con Google.");
    }
  };

  const handleSignOut = () => {
    signOut(auth);
    setTranscription(null);
    setFilename("");
    toast.success('Sesión cerrada');
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <Layout user={user} onLogin={handleLogin} onLogout={handleSignOut}>
      <Toaster position="top-center" toastOptions={{
        className: 'dark:bg-gray-800 dark:text-white',
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          style: {
            background: '#10B981',
          },
        },
        error: {
          style: {
            background: '#EF4444',
          },
        },
      }} />

      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {user ? `Bienvenido, ${user.displayName}` : 'Transcribe tus audios gratis y rápido'}
            </p>
          </div>
        </div>

        <DashboardStats />

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-1 transition-colors duration-200">
          <AudioUploader onUpload={handleUpload} isUploading={isUploading} />
        </div>

        {transcription && (
          <TranscriptionViewer
            text={transcription}
            filename={filename}
            segments={segments}
          />
        )}

        <div className="mt-12">
          {user ? (
            <HistoryList
              history={history}
              loading={historyLoading}
              onSelect={handleHistorySelect}
            />
          ) : (
            <div className="text-center p-8 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 transition-colors duration-200">
              <p className="text-gray-600 dark:text-gray-300 mb-4">Inicia sesión para guardar y ver tu historial de transcripciones.</p>
              <button
                onClick={handleLogin}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Iniciar Sesión con Google
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

export default App;
