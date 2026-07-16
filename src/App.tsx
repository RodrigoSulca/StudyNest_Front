import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import AppRouter from './routes/AppRouter';
import { useSocket } from './hooks/useSocket';
import { NotificationToast } from './components/notifications/NotificationToast';

function AppContent() {
  const { lastNotification } = useSocket();

  return (
    <>
      <AppRouter />
      <NotificationToast notification={lastNotification} />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
