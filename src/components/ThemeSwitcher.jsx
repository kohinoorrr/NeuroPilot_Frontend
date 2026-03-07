import React, { useState } from 'react';
import { THEMES, useTheme } from '../utils/ThemeContext';
import './ThemeSwitcher.css';

/**
 * ThemeSwitcher — floating palette button in the top-right area.
 * Shows a palette of colored swatches that apply themes instantly.
 */
export default function ThemeSwitcher() {
    const { themeKey, setTheme } = useTheme();
    const [open, setOpen] = useState(false);

    return (
        <div className={`ts-container ${open ? 'open' : ''}`}>
            {/* Swatch panel */}
            {open && (
                <div className="ts-panel">
                    <div className="ts-panel-title">THEME MATRIX</div>
                    {Object.entries(THEMES).map(([key, t]) => (
                        <button
                            key={key}
                            className={`ts-option ${themeKey === key ? 'active' : ''}`}
                            style={{ '--t-color': t.primary }}
                            onClick={() => { setTheme(key); setOpen(false); }}
                        >
                            <span className="ts-swatch" style={{ background: t.primary, boxShadow: `0 0 10px ${t.primary}` }} />
                            <div className="ts-info">
                                <span className="ts-name">{t.name}</span>
                                <span className="ts-desc">{t.desc}</span>
                            </div>
                            {themeKey === key && <span className="ts-check">✓</span>}
                        </button>
                    ))}
                </div>
            )}

            {/* Toggle button */}
            <button
                className="ts-toggle"
                onClick={() => setOpen(v => !v)}
                style={{ '--t-color': THEMES[themeKey]?.primary || '#00d4ff' }}
                aria-label="Change Theme"
                title="Change Theme"
            >
                <span className="ts-toggle-swatch" style={{ background: THEMES[themeKey]?.primary || '#00d4ff', boxShadow: `0 0 12px ${THEMES[themeKey]?.primary}` }} />
                <span className="ts-toggle-label">THEME</span>
            </button>
        </div>
    );
}
