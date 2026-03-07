import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import MainDashboard from './pages/MainDashboard';
import FocusMode from './pages/FocusMode';
import InsightsAnalytics from './pages/InsightsAnalytics';
import KnowledgeMap from './pages/KnowledgeMap';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import ComponentUsageReport from './pages/ComponentUsageReport';
import MonolabShowcase from './pages/MonolabShowcase';
import ComponentDodger from './pages/ComponentDodger';
import { Layout } from './components/monolab/Layout/Layout';
import JarvisIntro from './components/JarvisIntro';
import HolographicCursor from './components/HolographicCursor';
import FloatingNav from './components/FloatingNav';
import GridFlipTransition from './components/GridFlipTransition';
import ThemeWallpaper from './components/ThemeWallpaper';
import { ThemeProvider } from './utils/ThemeContext';

/* Routes rendered INSIDE the Layout (navbar + sidebar visible) */
function LayoutRoutes() {
    const location = useLocation();
    return (
        <div className="page-enter" key={location.pathname}>
            <Routes location={location}>
                <Route path="/" element={<MainDashboard />} />
                <Route path="/focus" element={<FocusMode />} />
                <Route path="/insights" element={<InsightsAnalytics />} />
                <Route path="/knowledge-map" element={<KnowledgeMap />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/monolab-report" element={<ComponentUsageReport />} />
                <Route path="/monolab-components" element={<MonolabShowcase />} />
            </Routes>
        </div>
    );
}

/* Routes rendered OUTSIDE the Layout (full-screen, no navbar) */
function FullscreenRoutes() {
    const location = useLocation();
    return (
        <Routes location={location}>
            <Route path="/dodger" element={<ComponentDodger />} />
        </Routes>
    );
}

function Inner() {
    const handleNavigate = (path) => {
        if (window.__gridFlip) window.__gridFlip(path);
    };

    return (
        <GridFlipTransition>
            {/* MP4 video wallpaper — unique per theme */}
            <ThemeWallpaper />

            {/* Full-screen routes (no layout chrome) */}
            <FullscreenRoutes />

            {/* Normal app shell */}
            <Routes>
                <Route path="/dodger" element={null} />
                <Route path="*" element={
                    <Layout>
                        <LayoutRoutes />
                    </Layout>
                } />
            </Routes>

            <FloatingNav onNavigate={handleNavigate} />
        </GridFlipTransition>
    );
}

export default function App() {
    const [introComplete, setIntroComplete] = useState(false);
    return (
        <ThemeProvider>
            <HolographicCursor />
            {!introComplete && <JarvisIntro onComplete={() => setIntroComplete(true)} />}
            {introComplete && (
                <BrowserRouter>
                    <Inner />
                </BrowserRouter>
            )}
        </ThemeProvider>
    );
}
