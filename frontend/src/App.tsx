import { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import AudioUploader from './components/AudioUploader';
import TranscriptionViewer from './components/TranscriptionViewer';
import { Layout } from './components/Layout/Layout';
import { useHistory } from './hooks/useHistory';
import HistoryList from './components/HistoryList';
import { auth } from './firebase';
import { onAuthStateChanged, type User, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [transcription, setTranscription] = useState<string | null>(null);
  const [segments, setSegments] = useState<any[]>([]); // Store segments for SRT export
  const [speakerCount, setSpeakerCount] = useState<number>(0);
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
    setSpeakerCount(0);
    setFilename(file.name);

    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('hf_token');
    if (token) {
      formData.append('hf_token', token);
    }

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
      setSpeakerCount(data.speaker_count || 0);

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
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            borderRadius: '12px',
            padding: '16px',
            fontSize: '15px',
            fontWeight: '500',
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
          },
          success: {
            iconTheme: {
              primary: '#10B981',
              secondary: 'white',
            },
            style: {
              background: '#10B981',
              color: 'white',
            },
          },
          error: {
            iconTheme: {
              primary: '#EF4444',
              secondary: 'white',
            },
            style: {
              background: '#EF4444',
              color: 'white',
            },
          },
        }}
      />

      <div className="space-y-8 animate-fade-in">
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

        {/* <DashboardStats /> */}

        {!transcription && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-1 transition-colors duration-200 animate-slide-up">
            <AudioUploader onUpload={handleUpload} isUploading={isUploading} />
          </div>
        )}

        {transcription && (
          <TranscriptionViewer
            text={transcription}
            filename={filename}
            segments={segments}
            speakerCount={speakerCount}
          />
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
