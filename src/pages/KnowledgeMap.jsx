import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Plus, Trash2, X, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { Button } from '../components/monolab/Button/Button';
import { IconButton } from '../components/monolab/Button/IconButton';
import { useTheme } from '../utils/ThemeContext';
import { THEMES } from '../utils/ThemeContext';
import './BrainOS.css';

/* ─── Workspace seed data ─────────────────────────── */
const SEED = [
    {
        id: 'ws-1', name: 'Project Alpha', desc: 'Product dev goals', color: '#00d4ff',
        files: [{ id: 'f1', name: 'Architecture.md', type: 'doc', preview: 'System design, API contracts...' }, { id: 'f2', name: 'Sprint Goals', type: 'board', preview: 'Q1 milestones, velocity...' }, { id: 'f3', name: 'Research Notes', type: 'note', preview: 'Competitor analysis, user interviews...' }]
    },
    {
        id: 'ws-2', name: 'Fitness Journey', desc: 'Health & workouts', color: '#00e676',
        files: [{ id: 'f4', name: 'Workout Log', type: 'log', preview: '5x5 strength, cardio HIIT...' }, { id: 'f5', name: 'Nutrition Plan', type: 'doc', preview: 'Macro targets, meal prep calendar...' }]
    },
    {
        id: 'ws-3', name: 'Learning Hub', desc: 'Courses & skill nodes', color: '#c060ff',
        files: [{ id: 'f6', name: 'React Patterns', type: 'code', preview: 'Context, hooks, compound components...' }, { id: 'f7', name: 'ML Notes', type: 'code', preview: 'Gradient descent, transformers...' }, { id: 'f8', name: 'Book Notes', type: 'note', preview: 'Deep Work, SICP, DDA...' }]
    },
    {
        id: 'ws-4', name: 'Finance Ops', desc: 'Investments & budget', color: '#ffaa00',
        files: [{ id: 'f9', name: 'Portfolio', type: 'chart', preview: 'MF ₹2.4L, Stocks ₹1.1L...' }, { id: 'f10', name: 'Monthly Budget', type: 'doc', preview: 'Rent, food, savings 32%...' }]
    },
];

const FILE_ICONS = { doc: '📄', board: '📋', note: '📝', log: '📊', code: '💻', chart: '📈', default: '🗂️' };
let _uid = 2000;
const uid = () => `id-${_uid++}`;

/* ─── Build star nodes from workspace data ───────── */
function buildNodes(workspaces) {
    const nodes = [];
    workspaces.forEach((ws, wi) => {
        // Hub node for workspace  
        const angle0 = (wi / workspaces.length) * Math.PI * 2;
        const baseR = 180;
        const cx = 500 + Math.cos(angle0) * baseR + (Math.random() - 0.5) * 60;
        const cy = 340 + Math.sin(angle0) * baseR + (Math.random() - 0.5) * 60;

        nodes.push({
            id: ws.id, wsId: ws.id, isHub: true,
            x: cx, y: cy, vx: (Math.random() - 0.5) * 0.14, vy: (Math.random() - 0.5) * 0.14,
            r: 6, color: ws.color, name: ws.name, desc: ws.desc,
        });

        // Satellite file nodes
        ws.files.forEach((f, fi) => {
            const a = (fi / ws.files.length) * Math.PI * 2 + Math.random();
            const d = 50 + Math.random() * 55;
            nodes.push({
                id: f.id, wsId: ws.id, isHub: false, fileId: f.id,
                x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d,
                vx: (Math.random() - 0.5) * 0.12, vy: (Math.random() - 0.5) * 0.12,
                r: 3, color: ws.color, name: f.name, type: f.type, preview: f.preview,
            });
        });
    });
    return nodes;
}

export default function KnowledgeMap() {
    const { themeKey } = useTheme();
    const theme = THEMES[themeKey] || THEMES.jarvis;

    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const nodesRef = useRef([]);
    const animIdRef = useRef(null);
    const dragRef = useRef(null);
    const prevDragPos = useRef(null);
    const isPanRef = useRef(false);
    const panStartRef = useRef({ mx: 0, my: 0, px: 0, py: 0 });

    const [workspaces, setWorkspaces] = useState(SEED);
    const [tooltip, setTooltip] = useState(null); // { node, cx, cy }
    const [selectedWs, setSelectedWs] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const panRef = useRef({ x: 0, y: 0 });

    const [addWsOpen, setAddWsOpen] = useState(false);
    const [newWsName, setNewWsName] = useState('');
    const [newFileName, setNewFileName] = useState('');
    const [addFileFor, setAddFileFor] = useState(null);

    // Sync nodes when workspaces change
    useEffect(() => {
        // Preserve positions of existing nodes
        const existing = {};
        nodesRef.current.forEach(n => { existing[n.id] = { x: n.x, y: n.y, vx: n.vx, vy: n.vy }; });
        const fresh = buildNodes(workspaces);
        fresh.forEach(n => { if (existing[n.id]) { Object.assign(n, existing[n.id]); } });
        nodesRef.current = fresh;
    }, [workspaces]);

    // Keep panRef in sync
    useEffect(() => { panRef.current = pan; }, [pan]);

    /* ─── Canvas draw loop ────────────────────────── */
    useEffect(() => {
        const canvas = canvasRef.current;
        const cont = containerRef.current;
        if (!canvas || !cont) return;

        const resize = () => { canvas.width = cont.clientWidth; canvas.height = cont.clientHeight; };
        resize();
        window.addEventListener('resize', resize);

        let t = 0;

        const draw = () => {
            t += 0.008;
            const ctx = canvas.getContext('2d');
            const W = canvas.width, H = canvas.height;
            ctx.clearRect(0, 0, W, H);

            const nodes = nodesRef.current;
            const { x: px, y: py } = panRef.current;

            ctx.save();
            ctx.translate(px, py);
            ctx.scale(zoom, zoom);

            /* ── Spring rope physics + drift ─────────────────────────── */
            // Build hub lookup for quick access
            const hubMap = {};
            nodes.forEach(n => { if (n.isHub) hubMap[n.wsId] = n; });

            nodes.forEach(n => {
                const isBeingDragged = dragRef.current?.nodeId === n.id;

                if (n.isHub && isBeingDragged) return; // hub moves directly in onMouseMove

                if (!n.isHub) {
                    // Spring force toward hub (rope/string effect)
                    const hub = hubMap[n.wsId];
                    if (hub) {
                        const dx = hub.x - n.x, dy = hub.y - n.y;
                        const dist = Math.sqrt(dx * dx + dy * dy);
                        if (dist > 0) {
                            // Natural rest length — satellites orbit at ~55–90px
                            const REST = 70;
                            const stretch = dist - REST;
                            // Spring: pull toward hub when stretched beyond REST
                            const k = stretch > 0 ? 0.025 : 0.008; // stiffer when stretched
                            n.vx += (dx / dist) * stretch * k;
                            n.vy += (dy / dist) * stretch * k;
                        }
                    }
                }

                if (!isBeingDragged) {
                    n.x += n.vx; n.y += n.vy;
                }

                // Soft boundary repulsion
                const W2 = 1000, H2 = 680;
                if (n.x < 40) n.vx += 0.06; if (n.x > W2) n.vx -= 0.06;
                if (n.y < 40) n.vy += 0.06; if (n.y > H2) n.vy -= 0.06;

                // Stronger damping for stretchy rope feel (not floaty)
                n.vx *= 0.88; n.vy *= 0.88;
            });

            /* Draw edges — thin lines between nearby nodes of same workspace */
            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const a = nodes[i], b = nodes[j];
                    const sameWs = a.wsId === b.wsId;
                    const dx = a.x - b.x, dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const maxD = sameWs ? 200 : 130;
                    if (dist < maxD) {
                        const alpha = (1 - dist / maxD) * (sameWs ? 0.55 : 0.12);
                        ctx.beginPath();
                        ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
                        ctx.strokeStyle = sameWs
                            ? `${a.color}${Math.round(alpha * 255).toString(16).padStart(2, '0')}`
                            : `rgba(255,255,255,${alpha * 0.4})`;
                        ctx.lineWidth = sameWs ? (a.isHub || b.isHub ? 1.2 : 0.7) : 0.4;
                        ctx.stroke();
                    }
                }
            }

            /* Draw nodes — glowing stars */
            nodes.forEach(n => {
                const pulse = Math.sin(t * 1.8 + n.x * 0.03) * 0.35 + 1;
                const r = n.r * pulse;

                // Outer glow halo
                const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
                grd.addColorStop(0, `${n.color}60`);
                grd.addColorStop(1, 'transparent');
                ctx.fillStyle = grd;
                ctx.beginPath(); ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2); ctx.fill();

                // Core dot
                ctx.beginPath(); ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
                ctx.fillStyle = n.isHub ? n.color : `${n.color}cc`;
                ctx.shadowBlur = n.isHub ? 14 : 8;
                ctx.shadowColor = n.color;
                ctx.fill();
                ctx.shadowBlur = 0;

                // Hub label badge
                if (n.isHub) {
                    ctx.font = `bold ${11 / zoom}px Inter, sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.fillStyle = 'rgba(255,255,255,0.9)';
                    ctx.fillText(n.name, n.x, n.y + r + 14 / zoom);
                }
            });

            ctx.restore();
            animIdRef.current = requestAnimationFrame(draw);
        };

        draw();
        return () => { cancelAnimationFrame(animIdRef.current); window.removeEventListener('resize', resize); };
    }, [workspaces, zoom]);

    /* ─── Screen→world coordinate helper ─────────── */
    const toWorld = useCallback((cx, cy) => {
        const rect = containerRef.current.getBoundingClientRect();
        return {
            x: (cx - rect.left - panRef.current.x) / zoom,
            y: (cy - rect.top - panRef.current.y) / zoom,
        };
    }, [zoom]);

    /* ─── Mouse events ────────────────────────────── */
    const hitTest = useCallback((wx, wy) => {
        return nodesRef.current.find(n => Math.hypot(wx - n.x, wy - n.y) < Math.max(n.r * 4, 14));
    }, []);

    const onMouseDown = useCallback((e) => {
        const { x: wx, y: wy } = toWorld(e.clientX, e.clientY);
        const hit = hitTest(wx, wy);
        if (hit) {
            // Store offset from node center to drag point
            dragRef.current = { nodeId: hit.id, isHub: hit.isHub, wsId: hit.wsId, offsetX: wx - hit.x, offsetY: wy - hit.y };
            prevDragPos.current = { x: wx, y: wy };
        } else {
            isPanRef.current = true;
            panStartRef.current = { mx: e.clientX, my: e.clientY, px: panRef.current.x, py: panRef.current.y };
        }
    }, [toWorld, hitTest]);

    const onMouseMove = useCallback((e) => {
        const { x: wx, y: wy } = toWorld(e.clientX, e.clientY);

        if (dragRef.current) {
            const drag = dragRef.current;
            const n = nodesRef.current.find(n => n.id === drag.nodeId);
            if (!n) return;

            if (drag.isHub) {
                // ─── Hub drag: move just the hub, rope physics handles satellites ───
                const dx = wx - prevDragPos.current.x;
                const dy = wy - prevDragPos.current.y;
                prevDragPos.current = { x: wx, y: wy };
                // Only move the hub itself
                const hub = nodesRef.current.find(n => n.id === drag.nodeId);
                if (hub) { hub.x += dx; hub.y += dy; hub.vx = 0; hub.vy = 0; }
            } else {
                // ─── Satellite drag: move just this node ────────────────────
                n.x = wx - drag.offsetX;
                n.y = wy - drag.offsetY;
                n.vx = 0; n.vy = 0;
            }
            return;
        }

        // Pan
        if (isPanRef.current) {
            setPan({
                x: panStartRef.current.px + (e.clientX - panStartRef.current.mx),
                y: panStartRef.current.py + (e.clientY - panStartRef.current.my),
            });
            return;
        }

        // Hover tooltip
        const hit = hitTest(wx, wy);
        if (hit) {
            const rect = containerRef.current.getBoundingClientRect();
            setTooltip({ node: hit, cx: e.clientX - rect.left + 14, cy: e.clientY - rect.top - 10 });
        } else {
            setTooltip(null);
        }
    }, [toWorld, hitTest]);

    const onMouseUp = useCallback((e) => {
        if (dragRef.current) {
            const drag = dragRef.current;

            if (!drag.isHub) {
                // ─── Satellite reparenting ───────────────────────────────────
                // Find which hub it's now closest to
                const { x: wx, y: wy } = toWorld(e.clientX, e.clientY);
                const draggedNode = nodesRef.current.find(n => n.id === drag.nodeId);

                let closestHub = null;
                let closestDist = Infinity;
                nodesRef.current.forEach(n => {
                    if (n.isHub) {
                        const d = Math.hypot(draggedNode.x - n.x, draggedNode.y - n.y);
                        if (d < closestDist) { closestDist = d; closestHub = n; }
                    }
                });

                if (closestHub && closestHub.wsId !== drag.wsId && closestDist < 100) {
                    // Transfer: update node's wsId and color
                    draggedNode.wsId = closestHub.wsId;
                    draggedNode.color = closestHub.color;

                    // Update workspaces state: move file from old ws to new ws
                    const fileToMove = workspaces.find(w => w.id === drag.wsId)?.files.find(f => f.id === drag.nodeId);
                    if (fileToMove) {
                        setWorkspaces(prev => prev.map(w => {
                            if (w.id === drag.wsId) return { ...w, files: w.files.filter(f => f.id !== drag.nodeId) };
                            if (w.id === closestHub.wsId) return { ...w, files: [...w.files, fileToMove] };
                            return w;
                        }));
                    }
                }
            } else if (drag.isHub) {
                // Click (no real move) on hub → select workspace
                const { x: wx2, y: wy2 } = toWorld(e.clientX, e.clientY);
                const hub = nodesRef.current.find(n => n.id === drag.nodeId);
                if (hub) {
                    const moved = Math.hypot(wx2 - hub.x - drag.offsetX, wy2 - hub.y - drag.offsetY);
                    if (moved < 8) setSelectedWs(v => v === drag.wsId ? null : drag.wsId);
                }
            }

            dragRef.current = null;
            prevDragPos.current = null;
        }
        isPanRef.current = false;
    }, [toWorld, workspaces]);


    /* ─── Workspace actions ─────────────────────── */
    const addWorkspace = () => {
        if (!newWsName.trim()) return;
        const colors = ['#00d4ff', '#ff4422', '#00ff41', '#c060ff', '#ff6eb4', '#ffaa00', '#ff9fd4'];
        const newWs = { id: uid(), name: newWsName.trim(), desc: 'New workspace', color: colors[Math.floor(Math.random() * colors.length)], files: [] };
        setWorkspaces(p => [...p, newWs]);
        setNewWsName(''); setAddWsOpen(false);
    };

    const deleteWorkspace = (id) => {
        setWorkspaces(p => p.filter(w => w.id !== id));
        if (selectedWs === id) setSelectedWs(null);
    };

    const addFile = (wsId) => {
        if (!newFileName.trim()) return;
        const types = ['doc', 'note', 'code', 'board', 'log', 'chart'];
        const file = { id: uid(), name: newFileName.trim(), type: types[Math.floor(Math.random() * types.length)], preview: 'New node — click to edit...' };
        setWorkspaces(p => p.map(w => w.id === wsId ? { ...w, files: [...w.files, file] } : w));
        setNewFileName(''); setAddFileFor(null);
    };

    const deleteFile = (wsId, fileId) => {
        setWorkspaces(p => p.map(w => w.id === wsId ? { ...w, files: w.files.filter(f => f.id !== fileId) } : w));
    };

    const selectedWorkspace = workspaces.find(w => w.id === selectedWs);

    return (
        <div className="brainos-root animate-fade-in">
            {/* Header */}
            <div className="brainos-header">
                <div>
                    <h1 className="brainos-title">🧠 BrainOS <span className="brainos-sub">Neural Constellation</span></h1>
                    <p className="brainos-hint">Drag nodes to reposition · Click hub to open workspace · Stars drift on their own</p>
                </div>
                <div className="brainos-actions">
                    <IconButton icon={<ZoomOut size={18} />} variant="ghost" onClick={() => setZoom(z => Math.max(0.4, z - 0.15))} aria-label="Zoom out" />
                    <span className="brainos-zoom-label">{Math.round(zoom * 100)}%</span>
                    <IconButton icon={<ZoomIn size={18} />} variant="ghost" onClick={() => setZoom(z => Math.min(2.5, z + 0.15))} aria-label="Zoom in" />
                    <IconButton icon={<Maximize2 size={18} />} variant="ghost" onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }} aria-label="Reset view" />
                    <Button variant="primary" leftIcon={<Plus size={16} />} onClick={() => setAddWsOpen(true)}>
                        Add Workspace
                    </Button>
                </div>
            </div>

            {/* Canvas + overlays */}
            <div className="brainos-canvas-wrapper">
                <div
                    ref={containerRef}
                    className="brainos-canvas-container"
                    style={{ cursor: dragRef.current ? 'grabbing' : 'default' }}
                    onMouseDown={onMouseDown}
                    onMouseMove={onMouseMove}
                    onMouseUp={onMouseUp}
                    onMouseLeave={onMouseUp}
                >
                    <canvas ref={canvasRef} className="brainos-canvas" />
                </div>

                {/* Hover tooltip */}
                {tooltip && !dragRef.current && (
                    <div className="brainos-preview-tooltip"
                        style={{ left: tooltip.cx, top: tooltip.cy, '--ws-color': tooltip.node.color }}>
                        <div className="brainos-preview-dot" style={{ background: tooltip.node.color }} />
                        <div>
                            <div className="brainos-preview-name">{tooltip.node.name}</div>
                            {tooltip.node.isHub
                                ? <div className="brainos-preview-desc">{tooltip.node.desc}</div>
                                : <div className="brainos-preview-desc">{FILE_ICONS[tooltip.node.type]} {tooltip.node.preview}</div>
                            }
                        </div>
                    </div>
                )}

                {/* Side panel */}
                {selectedWorkspace && (
                    <div className="brainos-side-panel" style={{ '--ws-color': selectedWorkspace.color }}>
                        <div className="brainos-panel-header">
                            <div className="brainos-panel-dot" style={{ background: selectedWorkspace.color }} />
                            <h2 className="brainos-panel-title">{selectedWorkspace.name}</h2>
                            <button className="brainos-panel-close" onClick={() => setSelectedWs(null)}><X size={16} /></button>
                        </div>
                        <p className="brainos-panel-desc">{selectedWorkspace.desc}</p>

                        <div className="brainos-file-list">
                            {selectedWorkspace.files.map(f => (
                                <div key={f.id} className="brainos-file-item">
                                    <span className="brainos-file-icon">{FILE_ICONS[f.type] || '🗂️'}</span>
                                    <div className="brainos-file-info">
                                        <div className="brainos-file-name">{f.name}</div>
                                        <div className="brainos-file-preview">{f.preview}</div>
                                    </div>
                                    <button className="brainos-file-delete" onClick={() => deleteFile(selectedWorkspace.id, f.id)}><Trash2 size={13} /></button>
                                </div>
                            ))}
                        </div>

                        {addFileFor === selectedWorkspace.id ? (
                            <div className="brainos-add-row">
                                <input autoFocus className="brainos-input" placeholder="File name..."
                                    value={newFileName} onChange={e => setNewFileName(e.target.value)}
                                    onKeyDown={e => { if (e.key === 'Enter') addFile(selectedWorkspace.id); if (e.key === 'Escape') setAddFileFor(null); }} />
                                <Button variant="primary" size="sm" onClick={() => addFile(selectedWorkspace.id)}>Add</Button>
                                <Button variant="ghost" size="sm" onClick={() => setAddFileFor(null)}>✕</Button>
                            </div>
                        ) : (
                            <Button variant="outline" fullWidth leftIcon={<Plus size={14} />} onClick={() => setAddFileFor(selectedWorkspace.id)}>
                                Add Node
                            </Button>
                        )}

                        <Button variant="ghost" fullWidth leftIcon={<Trash2 size={14} />}
                            style={{ color: 'var(--color-danger)', marginTop: '0.75rem' }}
                            onClick={() => deleteWorkspace(selectedWorkspace.id)}>
                            Delete Workspace
                        </Button>
                    </div>
                )}
            </div>

            {/* Add workspace modal */}
            {addWsOpen && (
                <div className="brainos-modal-backdrop" onClick={() => setAddWsOpen(false)}>
                    <div className="brainos-modal" onClick={e => e.stopPropagation()}>
                        <h3 className="brainos-modal-title">✦ New Workspace</h3>
                        <input autoFocus className="brainos-input" placeholder="Workspace name..."
                            value={newWsName} onChange={e => setNewWsName(e.target.value)}
                            onKeyDown={e => { if (e.key === 'Enter') addWorkspace(); if (e.key === 'Escape') setAddWsOpen(false); }} />
                        <div className="brainos-modal-actions">
                            <Button variant="primary" onClick={addWorkspace}>Create</Button>
                            <Button variant="ghost" onClick={() => setAddWsOpen(false)}>Cancel</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
