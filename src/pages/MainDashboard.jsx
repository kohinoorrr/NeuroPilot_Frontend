import React, { useState, useEffect, useRef } from 'react';
import { Grid } from '../components/monolab/Layout/Grid';
import { Flex } from '../components/monolab/Layout/Flex';
import { Card } from '../components/monolab/DataDisplay/Card';
import { StatPanel } from '../components/monolab/DataDisplay/StatPanel';
import { Badge } from '../components/monolab/DataDisplay/Badge';
import { ProgressBar } from '../components/monolab/Feedback/ProgressBar';
import { Button } from '../components/monolab/Button/Button';
import { Brain, Zap, Target, Activity, AlignLeft, ChevronRight, Gamepad2 } from 'lucide-react';
import { useTrackComponent } from '../utils/ComponentTracker';
import { useNavigate } from 'react-router-dom';
import './MainDashboard.css';

/* === CountUp Hook === */
function useCountUp(target, duration = 1200) {
    const [value, setValue] = useState(0);
    useEffect(() => {
        let start = 0;
        const step = target / (duration / 16);
        const timer = setInterval(() => {
            start += step;
            if (start >= target) { setValue(target); clearInterval(timer); }
            else setValue(Math.floor(start));
        }, 16);
        return () => clearInterval(timer);
    }, [target, duration]);
    return value;
}

/* === 3D Tilt Card === */
function Tilt3D({ children, className, style, ...rest }) {
    const ref = useRef(null);
    const onMove = (e) => {
        const el = ref.current; if (!el) return;
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 14;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -14;
        el.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${y}deg) scale(1.02)`;
        el.style.boxShadow = `${-x * 2}px ${y * 2}px 40px rgba(0,212,255,0.18)`;
    };
    const onLeave = () => {
        const el = ref.current; if (!el) return;
        el.style.transform = '';
        el.style.boxShadow = '';
    };
    return (
        <div ref={ref} className={className}
            style={{ transition: 'transform 0.15s ease, box-shadow 0.15s ease', ...style }}
            onMouseMove={onMove} onMouseLeave={onLeave} {...rest}
        >{children}</div>
    );
}

/* === Button Zoom Transition ===
   Ripple expands from clicked button position to cover full screen,
   then navigates after the screen is covered.         */
function useButtonZoom() {
    const [ripple, setRipple] = useState(null); // { x, y, path }
    const navigate = useNavigate();

    const trigger = (e, path) => {
        const btn = e.currentTarget.getBoundingClientRect();
        const x = btn.left + btn.width / 2;
        const y = btn.top + btn.height / 2;
        setRipple({ x, y });
        setTimeout(() => { navigate(path); }, 480);
        setTimeout(() => { setRipple(null); }, 900);
    };

    const overlay = ripple ? (
        <div
            className="btn-zoom-overlay"
            style={{ '--bz-x': `${ripple.x}px`, '--bz-y': `${ripple.y}px` }}
        />
    ) : null;

    return { trigger, overlay };
}

/* === AI Log Ticker === */
const LOGS = [
    '▸ Scanning neural pathways...',
    '▸ BrainOS cluster sync: 98.7% integrity',
    '▸ Focus session optimization ready',
    '▸ Task queue: 3 high-priority items flagged',
    '▸ Productivity vector positive +4.2%',
    '▸ All subsystems: nominal',
    '▸ Memory consolidation running in background',
    '▸ New knowledge cluster: React Patterns',
];

function AiLogTicker() {
    const [idx, setIdx] = useState(0);
    const [text, setText] = useState('');
    const [ci, setCi] = useState(0);

    useEffect(() => {
        const line = LOGS[idx % LOGS.length];
        if (ci < line.length) {
            const t = setTimeout(() => { setText(line.slice(0, ci + 1)); setCi(c => c + 1); }, 28);
            return () => clearTimeout(t);
        } else {
            const t = setTimeout(() => { setIdx(i => i + 1); setCi(0); setText(''); }, 2400);
            return () => clearTimeout(t);
        }
    }, [ci, idx]);

    return (
        <div className="ai-ticker">
            <span className="ai-ticker-label">JARVIS</span>
            <span>{text}<span className="ai-ticker-cursor">▌</span></span>
        </div>
    );
}

export default function MainDashboard() {
    useTrackComponent('MainDashboard', 'Pages', 'Main', 'Primary command center dashboard');
    const { trigger: btnZoom, overlay: zoomOverlay } = useButtonZoom();

    const productivity = useCountUp(94);
    const focusMin = useCountUp(260, 1400);
    const tasks = useCountUp(12, 900);
    const nodes = useCountUp(1420, 1600);

    const insights = [
        {
            color: 'var(--color-primary)',
            title: 'Deep Work Block Available',
            desc: 'No meetings for 3 hours — initiate Focus Mode?',
            label: 'Start Focus',
            route: '/focus',
        },
        {
            color: 'var(--color-warning)',
            title: 'High Priority Task',
            desc: 'Finish System Architecture Doc (Due Tomorrow)',
            label: 'View',
            route: '/insights',
        },
        {
            color: 'var(--color-secondary)',
            title: 'New Knowledge Cluster',
            desc: 'Your recent notes on React form a new cluster.',
            label: 'Visualize',
            route: '/knowledge-map',
        },
    ];

    return (
        <div className="animate-fade-in dashboard-root">
            {/* Button zoom ripple overlay — rendered at body level */}
            {zoomOverlay}

            {/* Header */}
            <Flex justify="between" align="center" style={{ marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.9rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <Brain size={28} color="var(--color-primary)" style={{ filter: 'drop-shadow(0 0 8px var(--color-primary))' }} />
                        AI Life Command Center
                    </h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', letterSpacing: '0.06em' }}>
                        COMMANDER ONLINE · ALL SYSTEMS NOMINAL
                    </p>
                </div>
                <Button variant="primary" leftIcon={<Zap size={16} />} onClick={(e) => btnZoom(e, '/focus')}>
                    Optimize Day
                </Button>
            </Flex>

            {/* Stat Panels with CountUp */}
            <Grid columns={4} gap="md" style={{ marginBottom: '2rem' }}>
                <StatPanel title="Productivity Score" value={`${productivity}%`} trend="positive" trendValue="4%" icon={<Activity size={20} />} />
                <StatPanel title="Focus Time" value={`${Math.floor(focusMin / 60)}h ${focusMin % 60}m`} trend="positive" trendValue="1h" icon={<Target size={20} />} />
                <StatPanel title="Tasks Completed" value={`${tasks} / 15`} icon={<AlignLeft size={20} />} />
                <StatPanel title="BrainOS Nodes" value={nodes.toLocaleString()} trend="positive" trendValue="12" icon={<Brain size={20} />} />
            </Grid>

            {/* Main Grid */}
            <Grid columns={3} gap="lg">
                {/* Left 2/3: AI Insights */}
                <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
                    <Card variant="default" padding="none" style={{ height: '100%', overflow: 'hidden' }}>
                        <div style={{ padding: '1.5rem 1.5rem 1rem' }}>
                            <Flex justify="between" align="center">
                                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>AI Actionable Insights</h2>
                                <Badge variant="primary">3 Active</Badge>
                            </Flex>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            {insights.map((item, i) => (
                                <Tilt3D key={i}>
                                    <Card
                                        variant="elevated"
                                        padding="sm"
                                        className="monolab-card-clickable insight-card"
                                        style={{ margin: '0 1rem 0.75rem', borderLeft: `4px solid ${item.color}` }}
                                    >
                                        <Flex justify="between" align="center">
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <h4 style={{ marginBottom: '0.2rem', fontSize: '0.9rem' }}>{item.title}</h4>
                                                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-secondary)' }}>{item.desc}</p>
                                            </div>
                                            {/* ZOOM-INTO-BUTTON transition when clicked */}
                                            <button
                                                className="insight-action-btn"
                                                style={{ '--btn-color': item.color }}
                                                onClick={(e) => btnZoom(e, item.route)}
                                            >
                                                <span>{item.label}</span>
                                                <ChevronRight size={13} />
                                            </button>
                                        </Flex>
                                    </Card>
                                </Tilt3D>
                            ))}
                        </div>

                        <AiLogTicker />
                    </Card>
                </div>

                {/* Right 1/3: Daily Trajectory */}
                <div>
                    <Card variant="neon" padding="md" style={{ height: '100%' }}>
                        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1.5rem' }}>Daily Trajectory</h2>
                        <Flex direction="column" gap="lg">
                            {[
                                { label: 'Code Commits', ratio: '6/8', pct: 75, color: 'var(--color-primary)' },
                                { label: 'Learning', ratio: '45m/60m', pct: 75, color: 'var(--color-secondary)' },
                                { label: 'Fitness', ratio: 'Complete ✓', pct: 100, color: 'var(--color-success)' },
                            ].map(g => (
                                <div key={g.label}>
                                    <Flex justify="between" style={{ marginBottom: '0.4rem', fontSize: '0.85rem' }}>
                                        <span>{g.label}</span>
                                        <span style={{ color: g.color, fontFamily: 'var(--font-mono)', fontSize: '0.8rem' }}>{g.ratio}</span>
                                    </Flex>
                                    <ProgressBar value={g.pct} max={100} />
                                </div>
                            ))}
                        </Flex>
                        <div style={{ marginTop: '2rem' }}>
                            <Button fullWidth variant="secondary" onClick={(e) => btnZoom(e, '/settings')}>
                                Update Status
                            </Button>
                        </div>
                    </Card>

                    {/* ── Component Dodger game tile ── */}
                    <Card variant="neon" padding="md" style={{ marginTop: '1rem', background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,212,255,0.04))', border: '1px solid rgba(0,212,255,0.2)' }}>
                        <Flex align="center" gap="sm">
                            {/* Pulsing orb */}
                            <div style={{
                                width: 44, height: 44, borderRadius: '50%',
                                background: 'radial-gradient(circle, rgba(0,212,255,0.3), transparent)',
                                border: '1.5px solid var(--color-primary)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '1.3rem', flexShrink: 0,
                                boxShadow: '0 0 16px var(--color-primary-glow)',
                            }}>🚀</div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Component Dodger</div>
                                <div style={{ fontSize: '0.68rem', color: 'var(--color-text-muted)', fontFamily: 'var(--font-mono)' }}>
                                    Best: {localStorage.getItem('np-dodger-hi') || '0'} pts
                                </div>
                            </div>
                            <Button variant="primary" size="sm" onClick={(e) => btnZoom(e, '/dodger')}>
                                PLAY
                            </Button>
                        </Flex>
                    </Card>
                </div>
            </Grid>
        </div>
    );
}
