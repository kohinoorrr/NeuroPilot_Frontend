import React from 'react';
import { Bell, Search, Menu, X, Palette, Sun, Moon } from 'lucide-react';
import './Navbar.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';
import { IconButton } from '../Button/IconButton';
import { Avatar } from '../DataDisplay/Avatar';
import { THEMES, useTheme } from '../../../utils/ThemeContext';
import { PROFILE } from '../../../utils/profile';
import { useState, useEffect } from 'react';


export const Navbar = () => {
    useTrackComponent('Navbar', 'Navigation', 'Global', 'Top navigation bar with search and profile');

    const [time, setTime] = useState(new Date());
    const [notifOpen, setNotifOpen] = useState(false);
    const [themeOpen, setThemeOpen] = useState(false);
    const { themeKey, lightMode, setTheme, toggleLight } = useTheme();

    useEffect(() => {
        const t = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(t);
    }, []);

    const hh = time.getHours().toString().padStart(2, '0');
    const mm = time.getMinutes().toString().padStart(2, '0');
    const ss = time.getSeconds().toString().padStart(2, '0');
    const dateStr = time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase();

    const notifications = [
        { id: 1, icon: '⚡', title: 'Focus session ready', time: '2m ago', color: '#00d4ff' },
        { id: 2, icon: '🧠', title: 'New neural cluster detected', time: '7m ago', color: '#c0a040' },
        { id: 3, icon: '📊', title: 'Productivity up 12%', time: '1h ago', color: '#00e676' },
    ];

    return (
        <header className="jarvis-navbar">
            <div className="navbar-scan-line" />

            {/* LEFT: Menu + Search */}
            <div className="navbar-left">
                <IconButton icon={<Menu size={24} />} variant="ghost" size="lg" aria-label="Toggle Menu" />
                <div className="jarvis-search">
                    <Search size={16} className="search-icon" />
                    <input type="text" placeholder="Query knowledge base..." className="jarvis-search-input" />
                    <span className="search-hint">⌘K</span>
                </div>
            </div>

            {/* CENTER: Status */}
            <div className="navbar-center">
                <div className="hud-status-chip">
                    <span className="status-dot-live" />
                    NEURAL LINK ACTIVE
                </div>
            </div>

            {/* RIGHT */}
            <div className="navbar-right">
                {/* Clock */}
                <div className="hud-clock">
                    <span className="clock-time">{hh}:{mm}:{ss}</span>
                    <span className="clock-date">{dateStr}</span>
                </div>

                <div className="navbar-divider" />

                {/* Theme dropdown trigger */}
                <div className="nav-theme-wrapper">
                    <button
                        className="nav-theme-btn"
                        onClick={() => { setThemeOpen(v => !v); setNotifOpen(false); }}
                        aria-label="Change Theme"
                    >
                        <span className="nav-theme-dot" style={{
                            background: THEMES[themeKey]?.primary || '#00d4ff',
                            boxShadow: `0 0 8px ${THEMES[themeKey]?.primary || '#00d4ff'}`,
                        }} />
                        <Palette size={15} />
                    </button>

                    {themeOpen && (
                        <>
                            <div className="nav-theme-backdrop" onClick={() => setThemeOpen(false)} />
                            <div className="nav-theme-panel">
                                <div className="nav-theme-panel-title">THEME MATRIX</div>

                                {/* Dark / Light Toggle */}
                                <div className="nav-dark-light-row">
                                    <Moon size={14} style={{ color: 'var(--color-text-secondary)' }} />
                                    <span className="nav-dark-light-label">{lightMode ? 'LIGHT MODE' : 'DARK MODE'}</span>
                                    {/* Monolab-style pill toggle switch */}
                                    <button
                                        className={`nav-toggle-switch ${lightMode ? 'on' : ''}`}
                                        onClick={toggleLight}
                                        aria-label="Toggle Dark/Light mode"
                                    >
                                        <span className="nav-toggle-thumb">
                                            {lightMode ? <Sun size={10} /> : <Moon size={10} />}
                                        </span>
                                    </button>
                                </div>

                                {/* Theme options */}
                                {Object.entries(THEMES).map(([key, t]) => (
                                    <button
                                        key={key}
                                        className={`nav-theme-option ${themeKey === key ? 'active' : ''}`}
                                        style={{ '--tc': t.primary }}
                                        onClick={() => { setTheme(key); setThemeOpen(false); }}
                                    >
                                        <span className="nav-theme-swatch" style={{
                                            background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`,
                                            boxShadow: `0 0 8px ${t.primaryGlow || t.primary}`,
                                        }} />
                                        <div>
                                            <div className="nav-theme-name">{t.name}</div>
                                            <div className="nav-theme-desc">{t.desc}</div>
                                        </div>
                                        {themeKey === key && <span className="nav-theme-check">✓</span>}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                <div className="navbar-divider" />

                {/* Bell */}
                <div className="notif-wrapper">
                    <IconButton
                        icon={<Bell size={20} />}
                        variant="ghost"
                        size="lg"
                        aria-label="Notifications"
                        onClick={() => { setNotifOpen(v => !v); setThemeOpen(false); }}
                    />
                    <span className="notif-badge">3</span>

                    {notifOpen && (
                        <div className="notif-panel">
                            <div className="notif-panel-header">
                                <span>System Alerts</span>
                                <button onClick={() => setNotifOpen(false)} className="notif-close">
                                    <X size={14} />
                                </button>
                            </div>
                            {notifications.map((n, i) => (
                                <div key={n.id} className="notif-item" style={{ animationDelay: `${i * 0.08}s`, borderLeftColor: n.color }}>
                                    <span className="notif-icon">{n.icon}</span>
                                    <div>
                                        <div className="notif-title">{n.title}</div>
                                        <div className="notif-time">{n.time}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Avatar */}
                <div className="profile-trigger" onClick={() => alert('Profile opened!')}>
                    <Avatar src={PROFILE.avatar} alt={PROFILE.name} status="online" size="md" />
                </div>

            </div>
        </header>
    );
};
