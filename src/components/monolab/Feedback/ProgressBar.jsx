import React from 'react';
import clsx from 'clsx';
import './ProgressBar.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const ProgressBar = ({
    value = 0,
    max = 100,
    color = 'primary', // primary, secondary, accent, success, warning, danger
    size = 'md', // sm, md, lg
    showLabel = false,
    className
}) => {
    useTrackComponent('ProgressBar', 'Feedback & Status', 'Global', 'Linear progress indicator');

    const percentage = Math.min(100, Math.max(0, (value / max) * 100));

    return (
        <div className={clsx('monolab-progress-wrapper', className)}>
            <div className={clsx('monolab-progress-track', `monolab-progress-${size}`)}>
                <div
                    className={clsx('monolab-progress-fill', `fill-${color}`)}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {showLabel && (
                <div className="monolab-progress-label">
                    <span>{value} / {max}</span>
                    <span>{Math.round(percentage)}%</span>
                </div>
            )}
        </div>
    );
};
