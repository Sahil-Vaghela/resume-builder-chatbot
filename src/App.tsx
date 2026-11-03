import { ReactNode } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ChatScreen } from './pages/ChatScreen';
import { FileText, Loader2 } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="min-h-screen min-h-[100dvh] w-screen max-w-full bg-[#F7F7F4] dark:bg-[#121212] flex flex-col items-center justify-center p-4 select-none transition-colors duration-200">
      <div
        className="flex flex-col items-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl bg-[#FFFFFF] dark:bg-[#1E1E1E] border border-[#E5E5E5] dark:border-[#2E2E2E] neu-raised max-w-xs w-full text-center"
      >
        <div
          className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#F7F7F4] dark:bg-[#262626] flex items-center justify-center mb-4 text-[#047857] dark:text-[#10B981] neu-inset-sm"
        >
          <FileText className="w-7 h-7 sm:w-8 sm:h-8 stroke-[2.2]" />
        </div>
        <div className="flex items-center justify-center gap-2 text-sm font-semibold text-[#171717] dark:text-[#EDEDED] tracking-tight mb-1">
          <span>ResumeAI</span>
          <Loader2 className="w-4 h-4 animate-spin text-[#047857] dark:text-[#10B981]" />
        </div>
        <p className="text-xs text-[#737373] dark:text-[#A3A3A3]">Checking your session...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: ReactNode }) {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (currentUser) {
    return <Navigate to="/chat" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ChatScreen />} />
            <Route path="/chat" element={<ChatScreen />} />
            <Route
              path="/login"
              element={
                <PublicOnlyRoute>
                  <LoginPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/signup"
              element={
                <PublicOnlyRoute>
                  <SignupPage />
                </PublicOnlyRoute>
              }
            />
            <Route
              path="/forgot-password"
              element={
                <PublicOnlyRoute>
                  <ForgotPasswordPage />
                </PublicOnlyRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
