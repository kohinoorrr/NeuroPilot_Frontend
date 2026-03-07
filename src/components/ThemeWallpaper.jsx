import React, { useEffect, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';

/**
 * Per-theme video opacity (how visible the wallpaper is).
 * Dark mode: higher. Light mode: much lower + tinted overlay added.
 */
const CONFIG = {
    'jarvis': { dark: 0.45, light: 0.15, lightTint: 'rgba(232,244,255,0.72)' },
    'iron-man': { dark: 0.50, light: 0.15, lightTint: 'rgba(255,240,228,0.70)' },
    'matrix': { dark: 0.50, light: 0.15, lightTint: 'rgba(230,255,232,0.72)' },
    'nebula': { dark: 0.45, light: 0.14, lightTint: 'rgba(240,228,255,0.72)' },
    'ghost': { dark: 0.40, light: 0.12, lightTint: 'rgba(238,246,255,0.74)' },
    'sakura': { dark: 0.52, light: 0.16, lightTint: 'rgba(255,232,244,0.72)' },
};

export default function ThemeWallpaper() {
    const { themeKey, lightMode } = useTheme();
    const videoRef = useRef(null);

    // Reload video when theme changes
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const src = `/wallpapers/${themeKey}.mp4`;
        if (v.getAttribute('data-src') === src) return; // already loaded
        v.setAttribute('data-src', src);
        v.src = src;
        v.load();
        v.play().catch(() => { }); // suppress autoplay policy errors
    }, [themeKey]);

    const cfg = CONFIG[themeKey] || CONFIG.jarvis;
    const opacity = lightMode ? cfg.light : cfg.dark;

    return (
        <>
            {/* ==== FULLSCREEN VIDEO LAYER ==== */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                style={{
                    position: 'fixed',
                    top: 0, left: 0,
                    width: '100vw',
                    height: '100vh',
                    objectFit: 'cover',
                    /* CRITICAL: stays below all UI but above html/body */
                    zIndex: -10,
                    pointerEvents: 'none',
                    opacity,
                    transition: 'opacity 1s ease',
                    /* Extremely slight blur so UI elements pop against the video */
                    filter: 'blur(0.8px) saturate(1.25)',
                }}
                aria-hidden="true"
            />

            {/* ==== DARK VIGNETTE (dark mode) — softens edges for readability ==== */}
            {!lightMode && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: -9,
                        pointerEvents: 'none',
                        background: `
                            radial-gradient(ellipse 100% 100% at 50% 50%,
                                transparent 30%,
                                rgba(0,0,0,0.50) 100%
                            ),
                            linear-gradient(to bottom,
                                rgba(0,0,0,0.45) 0%,
                                transparent 18%,
                                transparent 78%,
                                rgba(0,0,0,0.55) 100%
                            )
                        `,
                    }}
                />
            )}

            {/* ==== LIGHT MODE TINT — ensures text stays readable over bright video ==== */}
            {lightMode && (
                <div
                    aria-hidden="true"
                    style={{
                        position: 'fixed',
                        inset: 0,
                        zIndex: -9,
                        pointerEvents: 'none',
                        background: cfg.lightTint,
                        transition: 'background 0.6s ease',
                    }}
                />
            )}
        </>
    );
}
