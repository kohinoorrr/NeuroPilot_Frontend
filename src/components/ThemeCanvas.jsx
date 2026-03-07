import React, { useRef, useEffect } from 'react';
import { useTheme } from '../utils/ThemeContext';

/* ============================================================
   THEME CANVAS — Live particle animations per theme
   ============================================================ */

/* ── SAKURA: Falling cherry blossom petals ───────────────── */
function drawSakura(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const petals = Array.from({ length: 55 }, () => ({
        x: Math.random() * W,
        y: Math.random() * H * -1,
        size: 4 + Math.random() * 9,
        speedY: 0.6 + Math.random() * 1.4,
        speedX: -0.4 + Math.random() * 0.8,
        rot: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.04,
        opacity: 0.4 + Math.random() * 0.55,
        swing: Math.random() * Math.PI * 2,
    }));

    function drawPetal(ctx, x, y, size, rot, opacity) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        ctx.globalAlpha = opacity;
        // Draw a 5-lobe sakura petal
        for (let i = 0; i < 5; i++) {
            ctx.save();
            ctx.rotate((i / 5) * Math.PI * 2);
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.bezierCurveTo(size * 0.4, -size * 0.4, size * 0.8, -size * 0.2, size * 0.5, -size * 0.8);
            ctx.bezierCurveTo(size * 0.2, -size * 1.2, -size * 0.2, -size * 1.2, -size * 0.5, -size * 0.8);
            ctx.bezierCurveTo(-size * 0.8, -size * 0.2, -size * 0.4, -size * 0.4, 0, 0);
            ctx.fillStyle = `hsl(${340 + Math.random() * 20}, 90%, ${70 + Math.random() * 20}%)`;
            ctx.fill();
            ctx.restore();
        }
        ctx.restore();
    }

    let animId;
    function animate() {
        ctx.clearRect(0, 0, W, H);
        petals.forEach(p => {
            p.swing += 0.015;
            p.y += p.speedY;
            p.x += p.speedX + Math.sin(p.swing) * 0.6;
            p.rot += p.rotSpeed;
            if (p.y > H + 20) { p.y = -20; p.x = Math.random() * W; }
            drawPetal(ctx, p.x, p.y, p.size, p.rot, p.opacity);
        });
        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

/* ── IRON MAN: Repulsor hex grid + energy particles ─────── */
function drawIronMan(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cx = W * 0.7, cy = H * 0.5; // repulsor center
    let pulse = 0;

    const sparks = Array.from({ length: 40 }, () => ({
        angle: Math.random() * Math.PI * 2,
        dist: 60 + Math.random() * 300,
        speed: 0.005 + Math.random() * 0.012,
        size: 1 + Math.random() * 3,
        color: Math.random() > 0.5 ? '#ff6622' : '#ffcc00',
        opacity: 0.3 + Math.random() * 0.6,
    }));

    function drawHex(x, y, r, opacity) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2 - Math.PI / 6;
            i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
                : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(255, 80, 20, ${opacity})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
    }

    let animId;
    function animate() {
        ctx.clearRect(0, 0, W, H);
        pulse += 0.035;

        // Hex grid overlay (faint)
        for (let row = 0; row < 15; row++) {
            for (let col = 0; col < 20; col++) {
                const hx = col * 52 + (row % 2) * 26;
                const hy = row * 44;
                const d = Math.hypot(hx - cx, hy - cy);
                const glow = Math.max(0, 1 - d / 460);
                drawHex(hx, hy, 22, 0.03 + glow * 0.15);
            }
        }

        // Repulsor core rings
        for (let ring = 1; ring <= 5; ring++) {
            const r = ring * 35 + Math.sin(pulse + ring) * 8;
            const alpha = (0.6 - ring * 0.1) * (0.5 + 0.5 * Math.sin(pulse * 2));
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(255, ${80 + ring * 20}, 0, ${alpha})`;
            ctx.lineWidth = 2 - ring * 0.2;
            ctx.stroke();
        }

        // Bright core
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 40);
        grad.addColorStop(0, `rgba(255, 220, 150, ${0.5 + 0.4 * Math.sin(pulse * 3)})`);
        grad.addColorStop(0.4, `rgba(255, 80, 0, ${0.3 + 0.2 * Math.sin(pulse * 2)})`);
        grad.addColorStop(1, 'rgba(255,40,0,0)');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(cx, cy, 40, 0, Math.PI * 2); ctx.fill();

        // Orbiting sparks
        sparks.forEach(s => {
            s.angle += s.speed;
            const sx = cx + Math.cos(s.angle) * s.dist;
            const sy = cy + Math.sin(s.angle) * s.dist;
            ctx.beginPath();
            ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = s.opacity * (0.5 + 0.5 * Math.sin(s.angle * 3));
            ctx.fill();
            ctx.globalAlpha = 1;
        });

        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

/* ── MATRIX: Falling character rain ─────────────────────── */
function drawMatrix(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    const cols = Math.floor(W / 16);
    const drops = Array.from({ length: cols }, () => Math.random() * -100);
    const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ01アβΣ∆ΠΦΨΩ';

    let animId;
    function animate() {
        ctx.fillStyle = 'rgba(0, 9, 0, 0.05)';
        ctx.fillRect(0, 0, W, H);

        drops.forEach((y, i) => {
            const char = chars[Math.floor(Math.random() * chars.length)];
            const bright = Math.random() > 0.96;
            ctx.font = `${bright ? 'bold' : 'normal'} 13px monospace`;
            ctx.fillStyle = bright ? '#ffffff' : `rgba(0, 255, 65, ${0.4 + Math.random() * 0.5})`;
            ctx.fillText(char, i * 16, y * 16);
            if (y * 16 > H && Math.random() > 0.975) drops[i] = 0;
            else drops[i] = y + 0.6;
        });
        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

/* ── NEBULA: Star particles + nebula wisps ───────────────── */
function drawNebula(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let t = 0;

    const stars = Array.from({ length: 160 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.5 + Math.random() * 2,
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.04,
        color: Math.random() > 0.5 ? '#c060ff' : '#ff40aa',
    }));
    const wisps = Array.from({ length: 6 }, (_, i) => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 80 + Math.random() * 160,
        hue: 260 + i * 20,
        phase: i * Math.PI / 3,
    }));

    let animId;
    function animate() {
        ctx.clearRect(0, 0, W, H);
        t += 0.005;

        // Drifting nebula wisps
        wisps.forEach(w => {
            const x = w.x + Math.sin(t + w.phase) * 30;
            const y = w.y + Math.cos(t * 0.7 + w.phase) * 20;
            const g = ctx.createRadialGradient(x, y, 0, x, y, w.r);
            g.addColorStop(0, `hsla(${w.hue}, 80%, 60%, 0.06)`);
            g.addColorStop(1, 'transparent');
            ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, w.r, 0, Math.PI * 2); ctx.fill();
        });

        // Stars
        stars.forEach(s => {
            s.twinkle += s.speed;
            const alpha = 0.3 + 0.7 * Math.abs(Math.sin(s.twinkle));
            ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = s.color;
            ctx.globalAlpha = alpha; ctx.fill(); ctx.globalAlpha = 1;
        });

        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

/* ── JARVIS: Scanning hex grid + data nodes ──────────────── */
function drawJarvis(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;
    let scanX = 0, t = 0;

    const nodes = Array.from({ length: 20 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 2 + Math.random() * 3,
        pulse: Math.random() * Math.PI * 2,
        speed: 0.02 + Math.random() * 0.03,
    }));

    function drawHex(x, y, r, alpha) {
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
            const a = (i / 6) * Math.PI * 2;
            i === 0 ? ctx.moveTo(x + r * Math.cos(a), y + r * Math.sin(a))
                : ctx.lineTo(x + r * Math.cos(a), y + r * Math.sin(a));
        }
        ctx.closePath();
        ctx.strokeStyle = `rgba(0, 212, 255, ${alpha})`;
        ctx.lineWidth = 0.6; ctx.stroke();
    }

    let animId;
    function animate() {
        ctx.clearRect(0, 0, W, H);
        t += 0.012; scanX = (scanX + 1.2) % (W + 80);

        // Hex grid
        for (let row = 0; row < 14; row++) {
            for (let col = 0; col < 22; col++) {
                const hx = col * 55 + (row % 2) * 27;
                const hy = row * 46;
                const scan = Math.abs(hx - scanX) < 40 ? 0.25 : 0;
                drawHex(hx, hy, 24, 0.04 + scan);
            }
        }

        // Scan line
        const sg = ctx.createLinearGradient(scanX - 50, 0, scanX + 50, 0);
        sg.addColorStop(0, 'transparent');
        sg.addColorStop(0.5, 'rgba(0,212,255,0.12)');
        sg.addColorStop(1, 'transparent');
        ctx.fillStyle = sg; ctx.fillRect(scanX - 50, 0, 100, H);

        // Data nodes
        nodes.forEach(n => {
            n.pulse += n.speed;
            const alpha = 0.3 + 0.6 * Math.abs(Math.sin(n.pulse));
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 212, 255, ${alpha})`; ctx.fill();
            // Outer ring
            ctx.beginPath(); ctx.arc(n.x, n.y, n.r + 4, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(0, 212, 255, ${alpha * 0.4})`; ctx.lineWidth = 1; ctx.stroke();
        });

        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

/* ── GHOST: Frost crystal particles ─────────────────────── */
function drawGhost(canvas) {
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const flakes = Array.from({ length: 80 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 1 + Math.random() * 4,
        speedY: 0.2 + Math.random() * 0.6,
        speedX: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
        drift: Math.random() * Math.PI * 2,
    }));

    let animId;
    function animate() {
        ctx.clearRect(0, 0, W, H);
        flakes.forEach(f => {
            f.drift += 0.008;
            f.y += f.speedY;
            f.x += f.speedX + Math.sin(f.drift) * 0.3;
            if (f.y > H) { f.y = -10; f.x = Math.random() * W; }
            ctx.beginPath(); ctx.arc(f.x, f.y, f.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(200, 230, 255, ${f.opacity})`;
            ctx.fill();
        });
        animId = requestAnimationFrame(animate);
    }
    animate();
    return () => cancelAnimationFrame(animId);
}

const DRAWERS = {
    jarvis: drawJarvis,
    'iron-man': drawIronMan,
    matrix: drawMatrix,
    nebula: drawNebula,
    ghost: drawGhost,
    sakura: drawSakura,
};

/**
 * ThemeCanvas — renders a live canvas animation that matches the active theme.
 */
export default function ThemeCanvas() {
    const { themeKey } = useTheme();
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Resize to viewport
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const onResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', onResize);

        const drawer = DRAWERS[themeKey] || drawJarvis;
        const cleanup = drawer(canvas);

        return () => {
            cleanup?.();
            window.removeEventListener('resize', onResize);
        };
    }, [themeKey]);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                inset: 0,
                zIndex: -1,
                pointerEvents: 'none',
                width: '100vw',
                height: '100vh',
                opacity: 0.85,
            }}
            aria-hidden="true"
        />
    );
}
