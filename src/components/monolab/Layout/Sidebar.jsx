import React from 'react';
import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { LayoutDashboard, Brain, BarChart2, Settings, Clock, UserCircle, Layers, Cpu } from 'lucide-react';
import './Sidebar.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

/** Main collapsible sidebar with JARVIS holographic styling */
export const Sidebar = () => {
    useTrackComponent('Sidebar', 'Navigation', 'Global', 'Main collapsible side navigation menu');

    const navItems = [
        { name: 'Command Center', icon: LayoutDashboard, path: '/' },
        { name: 'BrainOS Visualizer', icon: Brain, path: '/knowledge-map' },
        { name: 'Focus Mode', icon: Clock, path: '/focus' },
        { name: 'Insights', icon: BarChart2, path: '/insights' },
        { name: 'Settings', icon: Settings, path: '/settings' },
        { name: 'Profile', icon: UserCircle, path: '/profile' },
    ];

    const systemItems = [
        { name: 'Component Usage', icon: Cpu, path: '/monolab-report' },
        { name: 'Monolab Showcase', icon: Layers, path: '/monolab-components' },
    ];

    return (
        <aside className="monolab-sidebar">
            {/* Logo + Brand Header */}
            <div className="monolab-sidebar-header">
                <div className="monolab-sidebar-logo">
                    <Brain className="logo-icon animate-pulse-slow" size={26} />
                    <h1>NeuroPilot</h1>
                </div>
            </div>

            {/* Primary Navigation Links */}
            <nav className="monolab-sidebar-nav">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            end={item.path === '/'}
                            className={({ isActive }) => clsx('monolab-sidebar-link', isActive && 'active')}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}

                {/* System Integrity sub-section */}
                <div className="sidebar-section-label">System Integrity</div>
                {systemItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <NavLink
                            to={item.path}
                            key={item.name}
                            className={({ isActive }) => clsx('monolab-sidebar-link', isActive && 'active')}
                        >
                            <Icon size={18} />
                            <span>{item.name}</span>
                        </NavLink>
                    );
                })}
            </nav>

            {/* Footer: AI Online status */}
            <div className="monolab-sidebar-footer">
                <div className="ai-status">
                    <div className="status-dot" />
                    <span>AI Systems Online</span>
                </div>
            </div>
        </aside>
    );
};
