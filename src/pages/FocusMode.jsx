import React, { useState, useEffect } from 'react';
import { Card } from '../components/monolab/DataDisplay/Card';
import { Flex } from '../components/monolab/Layout/Flex';
import { Button } from '../components/monolab/Button/Button';
import { IconButton } from '../components/monolab/Button/IconButton';
import { Play, Pause, RotateCcw, Target } from 'lucide-react';

export default function FocusMode() {
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(25 * 60);

    useEffect(() => {
        let interval = null;
        if (isActive && timeLeft > 0) {
            interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
        }
        return () => clearInterval(interval);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const seconds = (timeLeft % 60).toString().padStart(2, '0');
    const progressPercent = ((25 * 60 - timeLeft) / (25 * 60)) * 100;

    return (
        <div className="animate-fade-in" style={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <Target size={48} color="var(--color-primary)" className={isActive ? 'animate-pulse-slow' : ''} style={{ margin: '0 auto 1rem', filter: 'drop-shadow(0 0 10px rgba(0,240,255,0.5))' }} />
                <h1>Deep Work Protocol</h1>
                <p style={{ color: 'var(--color-text-secondary)', marginTop: '0.5rem' }}>Eliminate distractions. Execute tasks.</p>
            </div>

            <Card variant={isActive ? 'neon' : 'elevated'} padding="lg" style={{ width: '400px', textAlign: 'center' }}>
                <div style={{ position: 'relative', width: '250px', height: '250px', margin: '0 auto 2rem' }}>
                    {/* Progress Ring Background */}
                    <svg width="250" height="250">
                        <circle cx="125" cy="125" r="110" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                            cx="125" cy="125" r="110"
                            fill="none"
                            stroke="var(--color-primary)"
                            strokeWidth="8"
                            strokeDasharray="691"
                            strokeDashoffset={691 - (691 * progressPercent) / 100}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: '50% 50%', filter: 'drop-shadow(0 0 8px rgba(0,240,255,0.5))' }}
                        />
                    </svg>
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontFamily: 'var(--font-mono)' }}>
                        <div style={{ fontSize: '4rem', fontWeight: '700', lineHeight: '1' }}>{minutes}:{seconds}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)', marginTop: '0.5rem', textTransform: 'uppercase', letterSpacing: '2px' }}>
                            {isActive ? 'Focusing' : 'Paused'}
                        </div>
                    </div>
                </div>

                <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <Button
                        variant={isActive ? 'danger' : 'primary'}
                        size="lg"
                        leftIcon={isActive ? <Pause size={20} /> : <Play size={20} />}
                        onClick={toggleTimer}
                        style={{ width: '150px' }}
                    >
                        {isActive ? 'Pause' : 'Start'}
                    </Button>
                    <div style={{ position: 'absolute', right: '1rem' }}>
                        <IconButton
                            icon={<RotateCcw size={20} />}
                            variant="outline"
                            size="lg"
                            onClick={resetTimer}
                            aria-label="Reset Timer"
                        />
                    </div>
                </div>
            </Card>
        </div>
    );
}
