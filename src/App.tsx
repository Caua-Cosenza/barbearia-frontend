import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { PrivateRoute } from './components/admin/PrivateRoute'
import { Home } from './pages/Home'
import { Confirmation } from './pages/Confirmation'
import { Cancel } from './pages/Cancel'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminDashboard } from './pages/admin/AdminDashboard'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/booking/confirmation" element={<Confirmation />} />
        <Route path="/cancelar/:token" element={<Cancel />} />
        <Route path="/privacidade" element={<PrivacyPolicy />} />

        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        {/* /admin redirect to dashboard */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  )
}
