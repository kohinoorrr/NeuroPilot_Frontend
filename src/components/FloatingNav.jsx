import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Brain, Clock, BarChart2, Settings, UserCircle, Layers, Cpu } from 'lucide-react';
import './FloatingNav.css';

const NAV_ITEMS = [
    { icon: LayoutDashboard, label: 'Command Center', path: '/', color: '#00d4ff' },
    { icon: Brain, label: 'BrainOS Visualizer', path: '/knowledge-map', color: '#c0a040' },
    { icon: Clock, label: 'Focus Mode', path: '/focus', color: '#00e676' },
    { icon: BarChart2, label: 'Insights', path: '/insights', color: '#4488ff' },
    { icon: Settings, label: 'Settings', path: '/settings', color: '#ff8800' },
    { icon: UserCircle, label: 'Profile', path: '/profile', color: '#b040ff' },
    { icon: Cpu, label: 'Component Report', path: '/monolab-report', color: '#00ccff' },
    { icon: Layers, label: 'Monolab Showcase', path: '/monolab-components', color: '#ffcc00' },
];

export default function FloatingNav({ onNavigate }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [expanded, setExpanded] = useState(false);
    const [tooltip, setTooltip] = useState(null);

    const handleOrbClick = (item) => {
        if (item.path === location.pathname) { setExpanded(false); return; }
        setExpanded(false);
        onNavigate?.(item.path);
    };

    return (
        <>
            {/* Hub — bottom-left corner, fans RIGHT */}
            <div className={`fn-hub ${expanded ? 'expanded' : ''}`} role="navigation" aria-label="Navigation">

                {/* Central toggle Brain orb */}
                <button
                    className={`fn-toggle ${expanded ? 'open' : ''}`}
                    onClick={() => setExpanded(v => !v)}
                    aria-label="Toggle Navigation"
                >
                    <Brain size={24} />
                    <span className="fn-toggle-ring" />
                    <span className="fn-toggle-ring fn-toggle-ring-2" />
                </button>

                {/* Fan of nav orbs — spread horizontally to the RIGHT */}
                <div className={`fn-orbs-fan ${expanded ? 'visible' : ''}`}>
                    {NAV_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                className={`fn-orb ${isActive ? 'active' : ''}`}
                                style={{
                                    '--orb-color': item.color,
                                    '--i': i,
                                }}
                                onClick={() => handleOrbClick(item)}
                                onMouseEnter={() => setTooltip({ label: item.label, idx: i })}
                                onMouseLeave={() => setTooltip(null)}
                                aria-label={item.label}
                            >
                                <Icon size={18} />
                                {isActive && <span className="fn-active-ring" style={{ borderColor: item.color }} />}
                                {/* Tooltip above each orb */}
                                {tooltip?.idx === i && (
                                    <span className="fn-tooltip" style={{ color: item.color, borderColor: item.color + '44' }}>
                                        {item.label}
                                    </span>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {expanded && (
                <div className="fn-backdrop" onClick={() => setExpanded(false)} />
            )}
        </>
    );
}
