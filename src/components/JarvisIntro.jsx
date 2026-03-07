import React, { useEffect, useState } from 'react';
import './JarvisIntro.css';
import { useTheme } from '../utils/ThemeContext';
import { THEMES } from '../utils/ThemeContext';

function speakJarvis(text) {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    // Natural human pace: rate 1.0, pitch 0.82 — not robotic, not slow
    utter.rate = 1.0; utter.pitch = 0.82; utter.volume = 1;
    const tryVoice = () => {
        const voices = window.speechSynthesis.getVoices();
        const prefer = (
            voices.find(v => /daniel/i.test(v.name)) ||
            voices.find(v => /google uk english male/i.test(v.name)) ||
            voices.find(v => /microsoft george/i.test(v.name)) ||
            voices.find(v => v.lang === 'en-GB') ||
            voices.find(v => v.lang.startsWith('en'))
        );
        if (prefer) utter.voice = prefer;
        window.speechSynthesis.speak(utter);
    };
    if (window.speechSynthesis.getVoices().length > 0) tryVoice();
    else window.speechSynthesis.onvoiceschanged = tryVoice;
}


export default function JarvisIntro({ onComplete }) {
    const { themeKey } = useTheme();
    const theme = THEMES[themeKey] || THEMES.jarvis;

    const [exiting, setExiting] = useState(false);
    const [orbScale, setOrbScale] = useState(1);

    useEffect(() => {
        // Apply theme colors immediately to intro CSS vars
        const el = document.documentElement;
        el.style.setProperty('--intro-primary', theme.primary);
        el.style.setProperty('--intro-secondary', theme.secondary);
        el.style.setProperty('--intro-glow', theme.primaryGlow);
        el.style.setProperty('--intro-bg', theme.bgBase);
    }, [themeKey]);

    useEffect(() => {
        const speechTimer = setTimeout(() => speakJarvis(
            'Hello Sir, welcome back. NeuroPilot is now online. All neural systems, engaged. How may I assist you today?'
        ), 800);

        let frame;
        let t = 0;
        const animate = () => {
            t += 0.07;
            const speaking = window.speechSynthesis?.speaking;
            const wavePulse = speaking
                ? Math.abs(Math.sin(t * 2.8)) * 0.28 + Math.abs(Math.sin(t * 6.1)) * 0.14 : 0;
            const spike = (speaking && Math.random() > 0.78) ? Math.random() * 0.25 : 0;
            setOrbScale(1 + wavePulse + spike);
            frame = requestAnimationFrame(animate);
        };
        const startAnim = setTimeout(() => { frame = requestAnimationFrame(animate); }, 1300);
        const stopAnim = setTimeout(() => { cancelAnimationFrame(frame); setOrbScale(1); }, 7000);
        const exitTimer = setTimeout(() => setExiting(true), 7200);
        const doneTimer = setTimeout(() => { window.speechSynthesis?.cancel(); onComplete?.(); }, 8000);

        return () => {
            clearTimeout(speechTimer); clearTimeout(startAnim);
            clearTimeout(stopAnim); clearTimeout(exitTimer); clearTimeout(doneTimer);
            cancelAnimationFrame(frame); window.speechSynthesis?.cancel();
        };
    }, [onComplete]);

    // Build dynamic glow based on theme + orb scale
    const orbGlow = `
        0 0 ${20 * orbScale}px ${theme.primary}cc,
        0 0 ${55 * orbScale}px ${theme.primaryGlow},
        inset 0 0 ${16 * orbScale}px ${theme.secondary}44
    `;

    return (
        <div className={`jarvis-intro ${exiting ? 'exiting' : ''}`}
            style={{ '--intro-primary': theme.primary, '--intro-secondary': theme.secondary, '--intro-glow': theme.primaryGlow, '--intro-bg': theme.bgBase }}>

            {/* Corner HUD brackets */}
            {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map(pos => (
                <div key={pos} className={`jarvis-corner ${pos}`}>
                    <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
                        <path d="M0 30 L0 0 L30 0" stroke="currentColor" strokeWidth="2" fill="none" />
                        <rect x="0" y="0" width="8" height="8" fill="currentColor" />
                    </svg>
                </div>
            ))}

            <div className="jarvis-reactor">
                <div className="jarvis-arc">
                    <div className="jarvis-arc-ring" />
                    <div className="jarvis-arc-ring" />
                    <div className="jarvis-arc-ring" />

                    {/* Voice-reactive orb with theme color */}
                    <div className="jarvis-arc-core" style={{
                        transform: `scale(${orbScale})`,
                        transition: 'transform 0.07s ease-out',
                        background: `radial-gradient(circle, ${theme.primary}33 0%, ${theme.secondary}22 60%, transparent 100%)`,
                        boxShadow: orbGlow,
                        border: `1.5px solid ${theme.primary}88`,
                    }}>
                        <div className="jarvis-wave-bars">
                            {Array.from({ length: 9 }, (_, i) => (
                                <div key={i} className="jarvis-wave-bar"
                                    style={{ animationDelay: `${i * 0.07}s`, background: theme.primary }} />
                            ))}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="jarvis-title" style={{ color: theme.primary, textShadow: `0 0 20px ${theme.primaryGlow}` }}>
                        NeuroPilot
                    </div>
                    <div className="jarvis-subtitle" style={{ color: theme.secondary }}>
                        AI Life Command System · v4.0
                    </div>
                </div>

                <div className="jarvis-progress-bar-outer">
                    <div className="jarvis-progress-bar-inner"
                        style={{ background: `linear-gradient(90deg, ${theme.primary}, ${theme.secondary})` }} />
                </div>

                <div className="jarvis-status-lines">
                    {[
                        '▸ NEURAL CORE ONLINE',
                        '▸ KNOWLEDGE MATRIX LOADED — 1,420 NODES',
                        '▸ AI SUBSYSTEMS ENGAGED',
                        '▸ WELCOME BACK, COMMANDER.',
                    ].map((line, i) => (
                        <div key={i} className="jarvis-status-line"
                            style={{ animationDelay: `${0.5 + i * 0.4}s`, color: i === 3 ? theme.secondary : theme.primary }}>
                            {line}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
