import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Accounts from './pages/Accounts';
import CloudTrailLogs from './pages/CloudTrailLogs';
import Security from './pages/Security';
import Architecture from './pages/Architecture';
import Compliance from './pages/Compliance';
import Login from './pages/Login';
import Signup from './pages/Signup';

function DashboardLayout({ children }) {
  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected Dashboard Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Dashboard />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/accounts"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Accounts />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/logs"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <CloudTrailLogs />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/security"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Security />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/architecture"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Architecture />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/compliance"
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Compliance />
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
