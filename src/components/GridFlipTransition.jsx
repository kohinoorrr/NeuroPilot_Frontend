import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './GridFlipTransition.css';

const COLS = 8;
const ROWS = 6;
const TOTAL = COLS * ROWS;

const TRANSITIONS = ['grid-flip', 'vortex', 'particle-zoom', 'shutter', 'dissolve'];
let lastTransition = '';

function pickTransition() {
    const filtered = TRANSITIONS.filter(t => t !== lastTransition);
    const pick = filtered[Math.floor(Math.random() * filtered.length)];
    lastTransition = pick;
    return pick;
}

function getDelay(type, i, row, col) {
    const centerR = (ROWS - 1) / 2;
    const centerC = (COLS - 1) / 2;
    const dist = Math.sqrt(Math.pow(row - centerR, 2) + Math.pow(col - centerC, 2));
    switch (type) {
        case 'vortex': {
            const angle = Math.atan2(row - centerR, col - centerC);
            return ((angle + Math.PI) / (2 * Math.PI) + dist * 0.03) * 0.7;
        }
        case 'particle-zoom': return dist * 0.035;
        case 'shutter': return row * 0.1 + col * 0.005;
        case 'dissolve': return Math.random() * 0.9;
        default: return dist * 0.055; // grid-flip center-out
    }
}

/** Pick which of the 3 theme CSS-var cell colors to use per cell */
function getCellColorVar(type, row, col, i) {
    if (type === 'shutter') return row % 2 === 0 ? 'var(--theme-grid-cell-1)' : 'var(--theme-grid-cell-3)';
    if (type === 'dissolve') return `var(--theme-grid-cell-${(i % 3) + 1})`;
    // depth-based for grid-flip & zoom
    const depth = Math.floor(((ROWS - 1 - row) / ROWS) * 3);
    return `var(--theme-grid-cell-${Math.min(depth + 1, 3)})`;
}

export default function GridFlipTransition({ children }) {
    const navigate = useNavigate();
    const [phase, setPhase] = useState('idle');
    const [cells, setCells] = useState([]);
    const [transType, setType] = useState('grid-flip');
    const phaseRef = useRef('idle');

    const startFlip = useCallback((path) => {
        if (phaseRef.current !== 'idle') return;

        const type = pickTransition();
        setType(type);
        phaseRef.current = 'in';

        const cellData = Array.from({ length: TOTAL }, (_, i) => {
            const row = Math.floor(i / COLS);
            const col = i % COLS;
            return {
                index: i, row, col,
                delay: getDelay(type, i, row, col),
                colorVar: getCellColorVar(type, row, col, i),
            };
        });

        setCells(cellData);
        setPhase('in');

        const inDone = 1.6;
        const outStart = inDone + 0.12;
        const totalEnd = outStart + 1.3;

        setTimeout(() => navigate(path), inDone * 1000);
        setTimeout(() => { phaseRef.current = 'out'; setPhase('out'); }, outStart * 1000);
        setTimeout(() => { phaseRef.current = 'idle'; setPhase('idle'); setCells([]); }, totalEnd * 1000);
    }, [navigate]);

    React.useEffect(() => {
        window.__gridFlip = startFlip;
        return () => { delete window.__gridFlip; };
    }, [startFlip]);

    return (
        <>
            {children}
            {phase !== 'idle' && (
                <div className={`gft-overlay gft-${transType} ${phase === 'out' ? 'gft-exiting' : ''}`}>
                    <div className="gft-grid" style={{
                        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
                        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
                    }}>
                        {cells.map(({ index, row, col, delay, colorVar }) => (
                            <div
                                key={index}
                                className={`gft-cell ${phase}`}
                                style={{
                                    '--delay': `${delay}s`,
                                    '--out-delay': `${Math.max(0, 0.8 - delay * 0.7)}s`,
                                    gridColumn: col + 1,
                                    gridRow: row + 1,
                                    background: colorVar, // uses theme CSS variable
                                }}
                            >
                                <div className="gft-cell-shine" />
                            </div>
                        ))}
                    </div>

                    <div className="gft-hud">
                        <div className="gft-hud-r1" />
                        <div className="gft-hud-r2" />
                        <div className="gft-hud-core" />
                    </div>
                </div>
            )}
        </>
    );
}
