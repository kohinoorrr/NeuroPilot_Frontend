import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
    'jarvis': { name: 'JARVIS Blue', desc: 'Arc Reactor Cyan', primary: '#00d4ff', primaryDark: '#0088bb', primaryGlow: 'rgba(0,212,255,0.35)', secondary: '#c0a040', secondaryGlow: 'rgba(192,160,64,0.3)', accent: '#4488ff', success: '#00e676', danger: '#ff3060', warning: '#ffaa00', bgBase: '#020914', bgSurface: '#06111f', bgElevated: '#0a1a2e', glassBg: 'rgba(6,17,31,0.55)', glassBorder: 'rgba(0,212,255,0.15)', gridCell1: 'rgba(0,200,255,0.92)', gridCell2: 'rgba(0,130,210,0.88)', gridCell3: 'rgba(0,70,160,0.85)' },
    'iron-man': { name: 'Iron Man', desc: 'Crimson & Gold', primary: '#ff4422', primaryDark: '#cc2200', primaryGlow: 'rgba(255,68,34,0.4)', secondary: '#ffaa00', secondaryGlow: 'rgba(255,170,0,0.3)', accent: '#ff6600', success: '#88ff44', danger: '#ff1111', warning: '#ffcc00', bgBase: '#0f0502', bgSurface: '#1a0a04', bgElevated: '#271208', glassBg: 'rgba(20,6,2,0.65)', glassBorder: 'rgba(255,68,34,0.2)', gridCell1: 'rgba(255,80,20,0.92)', gridCell2: 'rgba(200,40,0,0.88)', gridCell3: 'rgba(140,20,0,0.85)' },
    'matrix': { name: 'Matrix Green', desc: 'Digital rain', primary: '#00ff41', primaryDark: '#00bb30', primaryGlow: 'rgba(0,255,65,0.35)', secondary: '#44ff88', secondaryGlow: 'rgba(68,255,136,0.25)', accent: '#00cc33', success: '#00ff41', danger: '#ff3333', warning: '#aaff00', bgBase: '#000900', bgSurface: '#001400', bgElevated: '#002000', glassBg: 'rgba(0,14,0,0.65)', glassBorder: 'rgba(0,255,65,0.15)', gridCell1: 'rgba(0,255,65,0.90)', gridCell2: 'rgba(0,190,50,0.85)', gridCell3: 'rgba(0,120,30,0.82)' },
    'nebula': { name: 'Nebula Purple', desc: 'Deep space violet', primary: '#c060ff', primaryDark: '#8800ee', primaryGlow: 'rgba(192,96,255,0.35)', secondary: '#ff40aa', secondaryGlow: 'rgba(255,64,170,0.25)', accent: '#7733ff', success: '#44ffaa', danger: '#ff4466', warning: '#ffaa44', bgBase: '#07020f', bgSurface: '#0f0520', bgElevated: '#180830', glassBg: 'rgba(10,3,22,0.65)', glassBorder: 'rgba(192,96,255,0.18)', gridCell1: 'rgba(192,96,255,0.92)', gridCell2: 'rgba(130,50,200,0.88)', gridCell3: 'rgba(80,20,150,0.85)' },
    'ghost': { name: 'Ghost White', desc: 'Frost surgical', primary: '#88bbff', primaryDark: '#5588dd', primaryGlow: 'rgba(136,187,255,0.3)', secondary: '#aaccee', secondaryGlow: 'rgba(170,204,238,0.2)', accent: '#99bbdd', success: '#66ffcc', danger: '#ff6688', warning: '#ffee66', bgBase: '#050810', bgSurface: '#0a0f1e', bgElevated: '#101828', glassBg: 'rgba(255,255,255,0.04)', glassBorder: 'rgba(136,187,255,0.18)', gridCell1: 'rgba(200,225,255,0.92)', gridCell2: 'rgba(150,190,240,0.88)', gridCell3: 'rgba(100,150,210,0.85)' },
    'sakura': { name: 'Sakura Pink', desc: 'Cherry blossom', primary: '#ff6eb4', primaryDark: '#dd3388', primaryGlow: 'rgba(255,110,180,0.4)', secondary: '#ff9fd4', secondaryGlow: 'rgba(255,159,212,0.3)', accent: '#ff44aa', success: '#88ffcc', danger: '#ff4466', warning: '#ffaa66', bgBase: '#0f0509', bgSurface: '#1e0a14', bgElevated: '#2a0f1c', glassBg: 'rgba(22,6,14,0.65)', glassBorder: 'rgba(255,110,180,0.2)', gridCell1: 'rgba(255,110,180,0.92)', gridCell2: 'rgba(220,60,140,0.88)', gridCell3: 'rgba(170,20,100,0.85)' },
};

const DARK_TEXT = { primary: '#e8f4ff', secondary: '#6a8aaa', muted: '#3a5a7a' };
const LIGHT_TEXT = { primary: '#0a1428', secondary: '#2a4060', muted: '#4a6080' };

export const ThemeContext = createContext({ themeKey: 'nebula', lightMode: false, setTheme: () => { }, toggleLight: () => { } });

export function ThemeProvider({ children }) {
    const [themeKey, setThemeKey] = useState(() => localStorage.getItem('np-theme') || 'nebula');
    const [lightMode, setLightMode] = useState(() => localStorage.getItem('np-light') === 'true');

    useEffect(() => {
        const t = THEMES[themeKey] || THEMES.jarvis;
        const r = document.documentElement;
        const txt = lightMode ? LIGHT_TEXT : DARK_TEXT;

        // Theme colors
        r.style.setProperty('--color-primary', t.primary);
        r.style.setProperty('--color-primary-dark', t.primaryDark);
        r.style.setProperty('--color-primary-glow', t.primaryGlow);
        r.style.setProperty('--color-secondary', t.secondary);
        r.style.setProperty('--color-secondary-glow', t.secondaryGlow);
        r.style.setProperty('--color-accent', t.accent);
        r.style.setProperty('--color-success', t.success);
        r.style.setProperty('--color-danger', t.danger);
        r.style.setProperty('--color-warning', t.warning);

        // Text — switch completely for light/dark
        r.style.setProperty('--color-text-primary', txt.primary);
        r.style.setProperty('--color-text-secondary', txt.secondary);
        r.style.setProperty('--color-text-muted', txt.muted);

        // Backgrounds
        r.style.setProperty('--color-bg-base', lightMode ? '#e8f4ff' : t.bgBase);
        r.style.setProperty('--color-bg-surface', lightMode ? 'rgba(255,255,255,0.75)' : t.bgSurface);
        r.style.setProperty('--color-bg-surface-elevated', lightMode ? 'rgba(255,255,255,0.9)' : t.bgElevated);

        // Glass
        r.style.setProperty('--glass-bg', lightMode ? 'rgba(255,255,255,0.55)' : t.glassBg);
        r.style.setProperty('--glass-border', lightMode ? 'rgba(0,0,0,0.08)' : t.glassBorder);

        // Grid flip cells
        r.style.setProperty('--theme-grid-cell-1', t.gridCell1);
        r.style.setProperty('--theme-grid-cell-2', t.gridCell2);
        r.style.setProperty('--theme-grid-cell-3', t.gridCell3);

        // Derived
        r.style.setProperty('--glow-primary', `0 0 8px ${t.primaryGlow}, 0 0 30px ${t.primaryGlow}`);
        r.style.setProperty('--shadow-neon-primary', `0 0 14px ${t.primaryGlow}`);
        r.style.setProperty('--shadow-neon-secondary', `0 0 14px ${t.secondaryGlow}`);

        // Data attributes for CSS selectors
        r.setAttribute('data-theme', themeKey);
        r.setAttribute('data-light', lightMode ? 'true' : 'false');

        // Body background
        document.body.style.background = lightMode
            ? `radial-gradient(ellipse 80% 60% at 30% 40%, color-mix(in srgb, ${t.primary} 18%, transparent), transparent), #e8f4ff`
            : t.bgBase;

        localStorage.setItem('np-theme', themeKey);
        localStorage.setItem('np-light', String(lightMode));
    }, [themeKey, lightMode]);

    return (
        <ThemeContext.Provider value={{ themeKey, lightMode, setTheme: setThemeKey, toggleLight: () => setLightMode(v => !v) }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);
