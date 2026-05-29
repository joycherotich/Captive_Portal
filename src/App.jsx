import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
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

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route element={<Layout />}>
            <Route path="/packages" element={<PackagesPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/subscriptions" element={<SubscriptionsPage />} />
            <Route path="/providers" element={<ProvidersPage />} />
            <Route path="/link-provider" element={<LinkProviderPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/support" element={<SupportPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}