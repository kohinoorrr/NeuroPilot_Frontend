import React from 'react';
import { Navbar } from './Navbar';
import './Layout.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

/**
 * Layout — Main wrapper WITHOUT the sidebar.
 * Navigation is handled by the FloatingNav orbital orbs in App.jsx.
 */
export const Layout = ({ children }) => {
    useTrackComponent('Layout', 'Layout & Structure', 'Global', 'Main application wrapper setting full-screen content area');

    return (
        <div className="monolab-layout">
            {/* Full-width main area (no sidebar) */}
            <div className="monolab-layout-main">
                <Navbar />
                <main className="monolab-layout-content">
                    {children}
                </main>
            </div>
        </div>
    );
};
