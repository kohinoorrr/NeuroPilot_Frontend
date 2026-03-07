import React, { useEffect, useRef } from 'react';
import { useTheme } from '../utils/ThemeContext';

/**
 * HolographicCursor
 * - Inner dot: snaps directly to mouse position every rAF frame
 * - Outer ring: lerps toward mouse at ~12% per frame → buttery 60fps lag
 * - Colors are driven by the active theme CSS variable
 */
export default function HolographicCursor() {
    const { themeKey } = useTheme();
    const pos = useRef({ x: -100, y: -100 });  // target (real mouse)
    const ring = useRef({ x: -100, y: -100 });  // lagging ring position
    const rafId = useRef(null);
    const isHovering = useRef(false);

    useEffect(() => {
        const dot = document.getElementById('cursor-dot');
        const ring = document.getElementById('cursor-ring');
        if (!dot || !ring) return;

        // Read primary color from CSS var for theme-aware glow
        const getColor = () =>
            getComputedStyle(document.documentElement)
                .getPropertyValue('--color-primary').trim() || '#00d4ff';
        const getGlow = () =>
            getComputedStyle(document.documentElement)
                .getPropertyValue('--color-primary-glow').trim() || 'rgba(0,212,255,0.35)';

        const lerpPos = { x: -100, y: -100 };

        const onMove = (e) => {
            pos.current.x = e.clientX;
            pos.current.y = e.clientY;
        };

        // Interactive element listeners — expand ring on hover
        const onEnter = () => { isHovering.current = true; };
        const onLeave = () => { isHovering.current = false; };

        // MutationObserver keeps newly injected interactive els covered
        const attachHover = () => {
            document.querySelectorAll('a, button, [role="button"], input, label, .insight-action-btn, .monolab-btn')
                .forEach(el => {
                    if (el._npcursorBound) return;
                    el._npcursorBound = true;
                    el.addEventListener('mouseenter', onEnter);
                    el.addEventListener('mouseleave', onLeave);
                });
        };
        attachHover();
        const observer = new MutationObserver(attachHover);
        observer.observe(document.body, { childList: true, subtree: true });

        /** 60fps render loop */
        const render = () => {
            const LERP = 0.38; // fast snap — minimal lag, still smooth
            lerpPos.x += (pos.current.x - lerpPos.x) * LERP;
            lerpPos.y += (pos.current.y - lerpPos.y) * LERP;

            const color = getColor();
            const glow = getGlow();
            const hover = isHovering.current;
            const scale = hover ? 1.9 : 1;
            const size = 20 * scale;

            // Dot — snap directly
            dot.style.transform = `translate(${pos.current.x}px, ${pos.current.y}px) translate(-50%, -50%)`;
            dot.style.background = color;
            dot.style.boxShadow = `0 0 8px ${color}, 0 0 20px ${glow}`;

            // Ring — lerp
            ring.style.transform = `translate(${lerpPos.x}px, ${lerpPos.y}px) translate(-50%, -50%)`;
            ring.style.width = `${size}px`;
            ring.style.height = `${size}px`;
            ring.style.borderColor = color;
            ring.style.boxShadow = hover
                ? `0 0 12px ${glow}, inset 0 0 10px ${glow}`
                : `0 0 6px ${glow}`;
            ring.style.background = hover ? `color-mix(in srgb, ${color} 8%, transparent)` : 'transparent';

            rafId.current = requestAnimationFrame(render);
        };

        document.addEventListener('mousemove', onMove, { passive: true });
        rafId.current = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(rafId.current);
            document.removeEventListener('mousemove', onMove);
            observer.disconnect();
        };
    }, [themeKey]); // re-attach when theme changes so color updates instantly

    return (
        <>
            {/* Outer ring — larger, slower */}
            <div id="cursor-ring" style={{
                position: 'fixed',
                top: 0, left: 0,
                width: 20, height: 20,
                borderRadius: '50%',
                border: '1.5px solid var(--color-primary)',
                pointerEvents: 'none',
                zIndex: 99999,
                willChange: 'transform',
                transition: 'width 0.18s ease, height 0.18s ease, background 0.18s ease, box-shadow 0.18s ease',
            }} />
            {/* Inner dot — tight, instant */}
            <div id="cursor-dot" style={{
                position: 'fixed',
                top: 0, left: 0,
                width: 5, height: 5,
                borderRadius: '50%',
                background: 'var(--color-primary)',
                pointerEvents: 'none',
                zIndex: 100000,
                willChange: 'transform',
            }} />
        </>
    );
}
