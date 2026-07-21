import { BrowserRouter, Navigate, Routes, Route, useParams } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ProductPage from './pages/ProductPage';
import EcosystemPage from './pages/EcosystemPage';
import PodPage from './pages/PodPage';
import StrategicPartnershipsPage from './pages/StrategicPartnershipsPage';
import AboutPage from './pages/AboutPage';
import CommunityPage from './pages/CommunityPage';
import InquiryPage from './pages/InquiryPage';
import CapitalAccessPage from './pages/CapitalAccessPage';
import AdvancedTechComingSoonPage from './pages/AdvancedTechComingSoonPage';

const routerBasename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

function RedirectStrategicPod() {
  const { podSlug } = useParams();
  return <Navigate to={`/strategic-cxo-team/${podSlug}`} replace />;
}

export default function App() {
  return (
    <BrowserRouter basename={routerBasename}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="inquiry" element={<InquiryPage />} />
          <Route path="practices/:slug" element={<ProductPage />} />
          <Route path="strategic-cxo-team" element={<StrategicPartnershipsPage />} />
          <Route path="strategic-cxo-team/:podSlug" element={<PodPage />} />
          <Route path="community" element={<CommunityPage />} />
          <Route path="capital-access-and-grant-services" element={<CapitalAccessPage />} />
          <Route path="innovation-and-advanced-tech" element={<AdvancedTechComingSoonPage />} />
          {/* Legacy URL redirects */}
          <Route path="strategic-partnerships" element={<Navigate to="/strategic-cxo-team" replace />} />
          <Route path="strategic-partnerships/:podSlug" element={<RedirectStrategicPod />} />
          <Route path="capital-access" element={<Navigate to="/capital-access-and-grant-services" replace />} />
          <Route path="advanced-tech" element={<Navigate to="/innovation-and-advanced-tech" replace />} />
          <Route path=":slug" element={<EcosystemPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
