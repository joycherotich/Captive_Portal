import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import AuthPage from './pages/AuthPage'
import Layout from './components/Layout'
import PackagesPage from './pages/PackagesPage'
import PaymentPage from './pages/PaymentPage'
import DashboardPage from './pages/DashboardPage'
import ProfilePage from './pages/ProfilePage'
import SubscriptionsPage from './pages/SubscriptionsPage'
import ProvidersPage from './pages/ProvidersPage'
import LinkProviderPage from './pages/LinkProviderPage'
import ServicesPage from './pages/ServicesPage'
import SupportPage from './pages/SupportPage'
import DevicesPage from './pages/DevicesPage'
import Preferences from './pages/Preferences'
import Routers from './pages/Routers'

// Must be INSIDE AppProvider to use useApp()
function ProtectedRoute({ children }) {
  const { user } = useApp()
  if (!user) return <Navigate to="/" replace />
  return children
}

function AuthRoute() {
  const { user } = useApp()
  if (user) return <Navigate to="/dashboard" replace />
  return <AuthPage />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />} />
      <Route element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route path="/packages"      element={<PackagesPage />} />
        <Route path="/payment"       element={<PaymentPage />} />
        <Route path="/dashboard"     element={<DashboardPage />} />
        <Route path="/profile"       element={<ProfilePage />} />
        <Route path="/subscriptions" element={<SubscriptionsPage />} />
        <Route path="/providers"     element={<ProvidersPage />} />
        <Route path="/link-provider" element={<LinkProviderPage />} />
        <Route path="/services"      element={<ServicesPage />} />
        <Route path="/support"       element={<SupportPage />} />
        <Route path="/devices"       element={<DevicesPage />} />
        <Route path="/preferences"   element={<Preferences />} />
        <Route path="/routers"       element={<Routers />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}