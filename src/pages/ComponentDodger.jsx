import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../utils/ThemeContext';
import { THEMES } from '../utils/ThemeContext';
import './ComponentDodger.css';

/* ─── Component definitions ─────────────────────────── */
const COMPONENTS = [
    { name: 'Button', w: 140, h: 42, score: 10, color: '#e2e2e2', type: 'button' },
    { name: 'Card', w: 220, h: 170, score: 40, color: '#a0c4ff', type: 'card' },
    { name: 'Toggle', w: 100, h: 48, score: 8, color: '#88ff9f', type: 'toggle' },
    { name: 'Dropdown', w: 170, h: 140, score: 25, color: '#ffd6a5', type: 'dropdown' },
    { name: 'Avatars', w: 130, h: 52, score: 15, color: '#ffadde', type: 'avatars' },
];

const LASER_SPEED = 14;
const SHIP_SPEED = 6;
const SHOOT_MS = 130;
const SPAWN_BASE_MS = 1000;

/* ─── Stars ─────────────────────────────────────────── */
function makeStars(W, H, n = 180) {
    return Array.from({ length: n }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        r: 0.5 + Math.random() * 1.2,
        speed: 0.15 + Math.random() * 0.5,
        a: 0.25 + Math.random() * 0.6,
    }));
}

/* ─── Explosion particles ────────────────────────────── */
function makeExplosion(x, y, color, n = 14) {
    return Array.from({ length: n }, () => ({
        x, y, color,
        vx: (Math.random() - 0.5) * 7,
        vy: (Math.random() - 0.5) * 7,
        life: 1, decay: 0.028 + Math.random() * 0.022, r: 2 + Math.random() * 5,
    }));
}

/* ─── Component canvas renderers (NO shadowBlur) ─────
   Each draws using fills, strokes, gradients only.
   shadowBlur freezes canvas at 60fps with multiple objects.
  ──────────────────────────────────────────────────── */
function drawButton(ctx, cx, cy, w, h) {
    const x = cx - w / 2, y = cy - h / 2, r = h / 2;
    // pill bg
    ctx.fillStyle = '#1a1a1a';
    ctx.strokeStyle = '#444'; ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, r); ctx.fill(); ctx.stroke();
    // spinner ring (3/4 arc)
    const spinR = h * 0.28, sx = cx - w * 0.22, sy = cy;
    ctx.strokeStyle = '#666'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sx, sy, spinR, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(sx, sy, spinR, -Math.PI / 2, Math.PI * 0.9); ctx.stroke();
    // text
    ctx.fillStyle = '#aaa'; ctx.font = `${Math.max(9, h * 0.28)}px Inter, sans-serif`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Loading...', cx + w * 0.1, cy);
    // label
    ctx.fillStyle = '#e2e2e2'; ctx.font = `bold ${Math.max(7, h * 0.22)}px Inter`;
    ctx.fillText('Button', cx, cy + h / 2 + 12);
}

function drawCard(ctx, cx, cy, w, h) {
    const x = cx - w / 2, y = cy - h / 2, r = 10;
    // card bg
    ctx.fillStyle = 'rgba(15,15,20,0.96)';
    ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, r); ctx.fill(); ctx.stroke();
    const pad = w * 0.08, row = h * 0.12;
    // title
    ctx.fillStyle = '#ddd'; ctx.font = `bold ${Math.max(7, h * 0.1)}px Inter`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    ctx.fillText('Login', x + pad, y + row * 0.4);
    // email field
    const fy = y + row * 1.6, fh = row * 0.85, fw = w - pad * 2;
    ctx.fillStyle = '#1c1c1c'; ctx.strokeStyle = '#444'; ctx.lineWidth = 0.8;
    roundRect(ctx, x + pad, fy, fw, fh, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.font = `${Math.max(6, fh * 0.55)}px Inter`;
    ctx.fillText('m@example.com', x + pad + 4, fy + fh * 0.22);
    // password field
    const py2 = fy + fh + row * 0.4;
    roundRect(ctx, x + pad, py2, fw, fh, 4); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#555'; ctx.fillText('Password', x + pad + 4, py2 + fh * 0.22);
    // login button
    const by = py2 + fh + row * 0.5;
    ctx.fillStyle = '#e8e8e8';
    roundRect(ctx, x + pad, by, fw, fh, 4); ctx.fill();
    ctx.fillStyle = '#111'; ctx.textAlign = 'center';
    ctx.fillText('Login', cx, by + fh * 0.25);
    // label
    ctx.fillStyle = '#a0c4ff'; ctx.font = `bold ${Math.max(7, h * 0.1)}px Inter`;
    ctx.fillText('Card', cx, cy + h / 2 + 12);
}

function drawToggle(ctx, cx, cy, w, h) {
    const tw = w * 0.5, th = h * 0.38, tx = cx - tw / 2, ty = cy - th / 2;
    // track — "on" state (foreground colored)
    ctx.fillStyle = '#e8e8e8';
    roundRect(ctx, tx, ty, tw, th, th / 2); ctx.fill();
    // thumb (right side = on)
    const thumbR = th / 2 - 2;
    ctx.fillStyle = '#222';
    ctx.beginPath(); ctx.arc(tx + tw - thumbR - 2, cy, thumbR, 0, Math.PI * 2); ctx.fill();
    // label
    ctx.fillStyle = '#88ff9f'; ctx.font = `bold ${Math.max(7, h * 0.18)}px Inter`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText('Toggle', cx, cy + h * 0.4);
}

function drawDropdown(ctx, cx, cy, w, h) {
    const x = cx - w / 2, y = cy - h / 2;
    const bw = w * 0.8, bh = h * 0.2, bx = cx - bw / 2, by = y + h * 0.04;
    // trigger button
    ctx.fillStyle = '#111'; ctx.strokeStyle = '#333'; ctx.lineWidth = 1;
    roundRect(ctx, bx, by, bw, bh, 5); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ccc'; ctx.font = `${Math.max(6, bh * 0.5)}px Inter`;
    ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    ctx.fillText('Columns  ▾', bx + 8, by + bh / 2);
    // dropdown panel
    const dw = bw, dy2 = by + bh + 2, dh = h * 0.65;
    ctx.fillStyle = '#111'; ctx.strokeStyle = '#2a2a2a';
    roundRect(ctx, bx, dy2, dw, dh, 4); ctx.fill(); ctx.stroke();
    const opts = ['status', 'email', 'amount', 'date'];
    opts.forEach((opt, i) => {
        const oy = dy2 + (i / opts.length) * dh + dh / opts.length * 0.1;
        const oh = dh / opts.length * 0.8;
        // checkbox
        const checked = i < 2;
        ctx.fillStyle = checked ? '#e8e8e8' : 'transparent';
        ctx.strokeStyle = checked ? '#e8e8e8' : '#444'; ctx.lineWidth = 0.8;
        roundRect(ctx, bx + 6, oy + oh * 0.2, oh * 0.7, oh * 0.7, 2); ctx.fill(); ctx.stroke();
        if (checked) { ctx.fillStyle = '#111'; ctx.fillText('✓', bx + 7, oy + oh * 0.32); }
        ctx.fillStyle = '#bbb'; ctx.font = `${Math.max(6, oh * 0.6)}px Inter`;
        ctx.fillText(opt, bx + 6 + oh + 4, oy + oh * 0.3);
    });
    // label
    ctx.fillStyle = '#ffd6a5'; ctx.font = `bold ${Math.max(7, h * 0.1)}px Inter`;
    ctx.textAlign = 'center';
    ctx.fillText('Dropdown', cx, cy + h / 2 + 12);
}

function drawAvatars(ctx, cx, cy, w, h) {
    const n = 3, r = h * 0.36, gap = r * 1.1;
    const colors = ['#a0c4ff', '#ffadde', '#caffbf'];
    const totalW = gap * (n - 1) + r * 2;
    const startX = cx - totalW / 2 + r;
    for (let i = n - 1; i >= 0; i--) {
        const ax = startX + i * gap;
        // border
        ctx.fillStyle = '#111';
        ctx.beginPath(); ctx.arc(ax, cy, r + 2, 0, Math.PI * 2); ctx.fill();
        // avatar circle
        ctx.fillStyle = colors[i];
        ctx.beginPath(); ctx.arc(ax, cy, r, 0, Math.PI * 2); ctx.fill();
        // face line
        ctx.strokeStyle = '#222'; ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.arc(ax, cy - r * 0.1, r * 0.4, Math.PI, 0); ctx.stroke(); // head arc
    }
    // +5 badge
    const bx = startX + n * gap;
    ctx.fillStyle = '#2a2a2a'; ctx.strokeStyle = '#555'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(bx, cy, r + 2, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = '#ddd'; ctx.font = `bold ${Math.max(6, r * 0.6)}px Inter`;
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+5', bx, cy);
    // label
    ctx.fillStyle = '#ffadde'; ctx.font = `bold ${Math.max(7, h * 0.18)}px Inter`;
    ctx.fillText('Avatars', cx, cy + h / 2 + 12);
}

/* helper for rounded rects */
function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y); ctx.arcTo(x + w, y, x + w, y + r, r);
    ctx.lineTo(x + w, y + h - r); ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
    ctx.lineTo(x + r, y + h); ctx.arcTo(x, y + h, x, y + h - r, r);
    ctx.lineTo(x, y + r); ctx.arcTo(x, y, x + r, y, r);
    ctx.closePath();
}

const RENDERERS = { button: drawButton, card: drawCard, toggle: drawToggle, dropdown: drawDropdown, avatars: drawAvatars };

function renderEnemy(ctx, e) {
    const fn = RENDERERS[e.type];
    if (fn) fn(ctx, e.screenX, e.y, e._sw, e._sh);
}

/* ─── MAIN COMPONENT ─────────────────────────────────── */
export default function ComponentDodger() {
    const { themeKey } = useTheme();
    const theme = THEMES[themeKey] || THEMES.jarvis;

    const canvasRef = useRef(null);
    const gsRef = useRef(null);
    const animRef = useRef(null);
    const keysRef = useRef({});
    const lastShot = useRef(0);
    const lastSpawn = useRef(0);
    const spawnMs = useRef(SPAWN_BASE_MS);

    const [phase, setPhase] = useState('start');
    const [highScore, setHighScore] = useState(() => +(localStorage.getItem('np-dodger-hi') || 0));
    const [finalScore, setFinalScore] = useState(0);

    const initGame = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const W = canvas.width, H = canvas.height;
        gsRef.current = {
            W, H,
            ship: { x: W / 2 },
            lasers: [], enemies: [], particles: [], popups: [],
            score: 0, lives: 3, combo: 0,
            stars: makeStars(W, H),
        };
        // CRITICAL: clear any stuck keys from previous session
        keysRef.current = {};
        lastShot.current = 0;
        lastSpawn.current = 0;
        spawnMs.current = SPAWN_BASE_MS;
    }, []);

    useEffect(() => {
        if (phase !== 'play') { cancelAnimationFrame(animRef.current); return; }
        const canvas = canvasRef.current;
        if (!canvas) return;
        initGame();
        const ctx = canvas.getContext('2d');

        // Disable image smoothing — slight perf gain
        ctx.imageSmoothingEnabled = false;

        const loop = (ts) => {
            const G = gsRef.current;
            if (!G) return;
            const { W, H } = G;
            const SHIPYARD = H - 70;

            ctx.clearRect(0, 0, W, H);

            /* Stars */
            ctx.fillStyle = '#000008';
            ctx.fillRect(0, 0, W, H);
            G.stars.forEach(s => {
                s.y += s.speed;
                if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
                ctx.fillStyle = `rgba(180,210,255,${s.a})`;
                ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
            });

            /* Ship movement */
            const spd = keysRef.current.shift ? SHIP_SPEED * 1.8 : SHIP_SPEED;
            if (keysRef.current['arrowleft'] || keysRef.current['a']) G.ship.x -= spd;
            if (keysRef.current['arrowright'] || keysRef.current['d']) G.ship.x += spd;
            G.ship.x = Math.max(30, Math.min(W - 30, G.ship.x));

            /* Auto-fire */
            if (ts - lastShot.current > SHOOT_MS) {
                G.lasers.push({ x: G.ship.x, y: SHIPYARD - 24 });
                lastShot.current = ts;
            }

            /* Spawn */
            if (ts - lastSpawn.current > spawnMs.current) {
                const comp = COMPONENTS[Math.floor(Math.random() * COMPONENTS.length)];
                G.enemies.push({
                    ...comp,
                    screenX: 80 + Math.random() * (W - 160),
                    y: -40,
                    speed: 1.4 + Math.random() * 1.3,
                    scaleT: 0,
                });
                lastSpawn.current = ts;
                spawnMs.current = Math.max(350, SPAWN_BASE_MS - G.score * 1.2);
            }

            /* Move lasers */
            const nextLasers = [];
            for (const l of G.lasers) {
                l.y -= LASER_SPEED;
                if (l.y > -10) nextLasers.push(l);
            }
            G.lasers = nextLasers;

            /* Move enemies + hit test */
            const aliveEnemies = [];
            for (const e of G.enemies) {
                e.y += e.speed;
                e.scaleT = Math.min(1, e.scaleT + 0.028);
                const scale = 0.65 + e.scaleT * 0.35;
                e._sw = e.w * scale;
                e._sh = e.h * scale;

                let killed = false;

                /* Laser collision — simple O(n²) but n is tiny */
                for (let li = G.lasers.length - 1; li >= 0; li--) {
                    const l = G.lasers[li];
                    if (
                        l.x > e.screenX - e._sw / 2 - 5 && l.x < e.screenX + e._sw / 2 + 5 &&
                        l.y > e.y - e._sh / 2 - 8 && l.y < e.y + e._sh / 2 + 8
                    ) {
                        G.particles.push(...makeExplosion(e.screenX, e.y, e.color));
                        const mult = 1 + Math.floor(G.combo / 5);
                        const pts = e.score * mult;
                        G.popups.push({ x: e.screenX, y: e.y - 20, pts, color: e.color, life: 1 });
                        G.score += pts;
                        G.combo++;
                        G.lasers.splice(li, 1);
                        killed = true;
                        break;
                    }
                }

                if (!killed && e.y > SHIPYARD + 30) {
                    G.particles.push(...makeExplosion(G.ship.x, SHIPYARD, '#ff4422'));
                    G.lives--;
                    G.combo = 0;
                    if (G.lives <= 0) {
                        const hi = Math.max(G.score, highScore);
                        localStorage.setItem('np-dodger-hi', hi);
                        setHighScore(hi);
                        setFinalScore(G.score);
                        setPhase('over');
                        return;
                    }
                    killed = true;
                }

                if (!killed) aliveEnemies.push(e);
            }
            G.enemies = aliveEnemies;

            /* Draw enemies — no shadowBlur */
            ctx.save(); ctx.textBaseline = 'top'; // reset each frame
            for (const e of G.enemies) renderEnemy(ctx, e);
            ctx.restore();

            /* Draw lasers — plain rect, no shadowBlur */
            for (const l of G.lasers) {
                const lg = ctx.createLinearGradient(l.x, l.y - 22, l.x, l.y);
                lg.addColorStop(0, 'transparent');
                lg.addColorStop(0.5, theme.primary + 'aa');
                lg.addColorStop(1, theme.primary);
                ctx.fillStyle = lg;
                ctx.fillRect(l.x - 2, l.y - 22, 4, 22);
            }

            /* Draw ship — no shadowBlur */
            const sx = G.ship.x;
            // engine glow via gradient only
            const eg = ctx.createRadialGradient(sx, SHIPYARD + 16, 0, sx, SHIPYARD + 16, 26);
            eg.addColorStop(0, theme.secondary + 'cc'); eg.addColorStop(1, 'transparent');
            ctx.fillStyle = eg; ctx.beginPath(); ctx.arc(sx, SHIPYARD + 16, 26, 0, Math.PI * 2); ctx.fill();
            // hull
            ctx.fillStyle = theme.primary;
            ctx.beginPath();
            ctx.moveTo(sx, SHIPYARD - 28);
            ctx.lineTo(sx - 20, SHIPYARD + 16); ctx.lineTo(sx - 9, SHIPYARD + 8);
            ctx.lineTo(sx, SHIPYARD + 14);
            ctx.lineTo(sx + 9, SHIPYARD + 8); ctx.lineTo(sx + 20, SHIPYARD + 16);
            ctx.closePath(); ctx.fill();

            /* Particles */
            const aliveP = [];
            for (const p of G.particles) {
                p.x += p.vx; p.y += p.vy; p.life -= p.decay;
                if (p.life > 0) {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.beginPath(); ctx.arc(p.x, p.y, p.r * p.life, 0, Math.PI * 2); ctx.fill();
                    aliveP.push(p);
                }
            }
            ctx.globalAlpha = 1;
            G.particles = aliveP;

            /* Popups */
            const alivePopups = [];
            for (const p of G.popups) {
                p.y -= 1.2; p.life -= 0.025;
                if (p.life > 0) {
                    ctx.globalAlpha = p.life;
                    ctx.fillStyle = p.color;
                    ctx.font = 'bold 14px "JetBrains Mono", monospace';
                    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
                    ctx.fillText(`+${p.pts}`, p.x, p.y);
                    alivePopups.push(p);
                }
            }
            ctx.globalAlpha = 1;
            G.popups = alivePopups;

            /* HUD — drawn on canvas, NO React setState during play */
            ctx.fillStyle = 'rgba(0,0,0,0.55)';
            ctx.fillRect(0, 0, W, 46);
            ctx.font = 'bold 13px "JetBrains Mono", monospace';
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'left'; ctx.fillStyle = theme.primary; ctx.fillText(`SCORE  ${G.score}`, 16, 24);
            ctx.textAlign = 'center'; ctx.fillStyle = theme.secondary;
            if (G.combo > 4) ctx.fillText(`✕${1 + Math.floor(G.combo / 5)} COMBO`, W / 2, 24);
            ctx.textAlign = 'right'; ctx.fillStyle = '#ff5577';
            ctx.fillText(`♥ `.repeat(G.lives).trim(), W - 16, 24);

            animRef.current = requestAnimationFrame(loop);
        };

        animRef.current = requestAnimationFrame(loop);

        const onKey = (e) => {
            // Normalize to lowercase so Shift+D and d always match
            keysRef.current[e.key.toLowerCase()] = e.type === 'keydown';
        };
        window.addEventListener('keydown', onKey);
        window.addEventListener('keyup', onKey);
        return () => {
            cancelAnimationFrame(animRef.current);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('keyup', onKey);
        };
    }, [phase, theme, initGame, highScore]);

    /* ─── UI screens ────────────────────────────────── */
    if (phase === 'start') return (
        <div className="cdg-screen">
            <div className="cdg-hero">
                <div className="cdg-orb" style={{ '--tc': theme.primary, '--ts': theme.secondary }}>🚀</div>
                <h1 className="cdg-title" style={{ color: theme.primary }}>COMPONENT DODGER</h1>
                <p className="cdg-sub">Real UI components are attacking.<br />Shoot them before they reach your ship.</p>
                <div className="cdg-controls-info">
                    <span>← → or A D to move</span><span>Hold Shift to boost</span>
                </div>
                <div className="cdg-score-preview">
                    <div className="cdg-score-grid">
                        {COMPONENTS.map(c => <span key={c.name} style={{ color: c.color }}>{c.name} +{c.score}</span>)}
                    </div>
                </div>
                {highScore > 0 && <div className="cdg-hi">Best: {highScore}</div>}
                <button className="cdg-start-btn" style={{ '--tc': theme.primary }} onClick={() => setPhase('play')}>
                    ENGAGE SYSTEMS
                </button>
            </div>
        </div>
    );

    if (phase === 'over') return (
        <div className="cdg-screen">
            <div className="cdg-hero">
                <div className="cdg-orb" style={{ '--tc': '#ff4422', '--ts': '#ff8800' }}>💀</div>
                <h1 className="cdg-title" style={{ color: '#ff4422' }}>SYSTEM BREACH</h1>
                <div className="cdg-final-score">
                    <div style={{ color: theme.primary }}>FINAL SCORE</div>
                    <div className="cdg-big-score">{finalScore}</div>
                    {finalScore >= highScore && finalScore > 0 && <div className="cdg-new-hi">🏆 NEW RECORD</div>}
                    <div style={{ color: '#888' }}>Best: {highScore}</div>
                </div>
                <button className="cdg-start-btn" style={{ '--tc': theme.primary }} onClick={() => setPhase('play')}>
                    REBOOT
                </button>
                <button className="cdg-start-btn" style={{ '--tc': '#666', fontSize: '0.8rem' }} onClick={() => setPhase('start')}>
                    MENU
                </button>
            </div>
        </div>
    );

    return (
        <div className="cdg-game-wrapper">
            <canvas ref={canvasRef} className="cdg-canvas" />
        </div>
    );
}
