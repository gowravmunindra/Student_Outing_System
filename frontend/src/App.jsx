import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import LandingPage from "./pages/LandingPage";
import StudentLoginPage from "./pages/student/StudentLoginPage";
import StudentDashboardPage from "./pages/student/StudentDashboardPage";
import StudentRequestFormPage from "./pages/student/StudentRequestFormPage";
import StudentHistoryPage from "./pages/student/StudentHistoryPage";
import WardenLoginPage from "./pages/warden/WardenLoginPage";
import WardenRegisterPage from "./pages/warden/WardenRegisterPage";
import WardenDashboardPage from "./pages/warden/WardenDashboardPage";
import WardenStudentRegisterPage from "./pages/warden/WardenStudentRegisterPage";
import WardenHistoryPage from "./pages/warden/WardenHistoryPage";
import AppShell from "./components/layout/AppShell";
import { AuthProvider, useAuth } from "./context/AuthContext";

function Protected({ roles, children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-center text-gray-400">Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route path="/student/login" element={<StudentLoginPage />} />

      <Route
        path="/student"
        element={
          <Protected roles={["student"]}>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<StudentDashboardPage />} />
        <Route path="request" element={<StudentRequestFormPage />} />
        <Route path="history" element={<StudentHistoryPage />} />
      </Route>

      <Route path="/warden/login" element={<WardenLoginPage />} />
      <Route path="/warden/register" element={<WardenRegisterPage />} />
      <Route
        path="/warden"
        element={
          <Protected roles={["warden"]}>
            <AppShell />
          </Protected>
        }
      >
        <Route index element={<WardenDashboardPage />} />
        <Route path="history" element={<WardenHistoryPage />} />
        <Route path="students" element={<WardenStudentRegisterPage />} />
      </Route>

      <Route
        path="/app"
        element={
          user?.role === "warden" ? (
            <Navigate to="/warden" replace />
          ) : (
            <Navigate to="/student" replace />
          )
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
      <Toaster 
        position="top-right" 
        toastOptions={{
          style: {
            background: '#ffffff',
            color: '#000',
            border: '1px solid rgba(0,0,0,0.1)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
    </AuthProvider>
  );
}
