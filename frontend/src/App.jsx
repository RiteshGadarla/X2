import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './state/AuthContext';
import { useAuth } from './state/auth-context';
import { ProtectedComponent } from './rbac/ProtectedComponent';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import RoleSelector from './components/RoleSelector';
import './index.css';

// Import Feature Modules
import LiveTicketQueue from './features/LiveTicketQueue';
import SLACompliance from './features/SLACompliance';
import SentimentFeed from './features/SentimentFeed';
import HILReviewQueue from './features/HILReviewQueue';
import KBPanel from './features/KBPanel';
import VocPanel from './features/VocPanel';
import IntegrationPanel from './features/IntegrationPanel';
import ExecutiveDashboard from './features/ExecutiveDashboard';
import LegalComplianceDashboard from './features/LegalComplianceDashboard';
import CustomerPortal from './features/CustomerPortal';

const AppContent = () => {
  const { role } = useAuth();

  if (!role) {
    return <RoleSelector />;
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        {/* Support & Manager Tiers */}
        <Route path="/tickets" element={
          <ProtectedComponent permission="VIEW_TICKETS" fallback={<Navigate to="/" replace />}><div className="route-page"><LiveTicketQueue /></div></ProtectedComponent>
        } />

        <Route path="/sla" element={
          <ProtectedComponent permission="VIEW_SLA" fallback={<Navigate to="/" replace />}><div className="route-page"><SLACompliance /></div></ProtectedComponent>
        } />

        <Route path="/sentiment" element={
          <ProtectedComponent permission="VIEW_SENTIMENT" fallback={<Navigate to="/" replace />}><div className="route-page"><SentimentFeed /></div></ProtectedComponent>
        } />

        <Route path="/hil" element={
          <ProtectedComponent permissions={["VIEW_HIL_STATUS", "APPROVE_HIL", "APPROVE_HIL_OVERRIDE", "MANAGE_LEGAL_CORRESPONDENCE"]} fallback={<Navigate to="/" replace />}><div className="route-page"><HILReviewQueue /></div></ProtectedComponent>
        } />

        <Route path="/legal" element={
          <ProtectedComponent permission="VIEW_LEGAL_TICKETS" fallback={<Navigate to="/" replace />}><div className="route-page"><LegalComplianceDashboard /></div></ProtectedComponent>
        } />

        <Route path="/kb" element={
          <ProtectedComponent permissions={["DRAFT_KB", "PUBLISH_KB", "VIEW_KB"]} fallback={<Navigate to="/" replace />}><div className="route-page"><KBPanel /></div></ProtectedComponent>
        } />

        {/* VP / Exec */}
        <Route path="/exec" element={
          <ProtectedComponent permission="VIEW_EXEC_DASH" fallback={<Navigate to="/" replace />}><div className="route-page"><ExecutiveDashboard /></div></ProtectedComponent>
        } />

        <Route path="/voc" element={
          <ProtectedComponent permission="VIEW_VOC" fallback={<Navigate to="/" replace />}><div className="route-page"><VocPanel /></div></ProtectedComponent>
        } />

        {/* Admin Ops */}
        <Route path="/integrations" element={
          <ProtectedComponent permission="MANAGE_INTEGRATIONS" fallback={<Navigate to="/" replace />}><div className="route-page"><IntegrationPanel /></div></ProtectedComponent>
        } />

        <Route path="/portal" element={
          <ProtectedComponent permission="VIEW_CUSTOMER_PORTAL" fallback={<Navigate to="/" replace />}><div className="route-page"><CustomerPortal /></div></ProtectedComponent>
        } />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
