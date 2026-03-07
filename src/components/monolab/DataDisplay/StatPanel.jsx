import React from 'react';
import { Card } from './Card';
import './StatPanel.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const StatPanel = ({
    title,
    value,
    trend, // positive, negative, neutral
    trendValue,
    icon,
    glowColor = 'primary',
    className
}) => {
    useTrackComponent('StatPanel', 'Data Display', 'Global', 'Dashboard metric display');

    return (
        <Card
            className={`monolab-stat-panel glow-${glowColor} ${className || ''}`}
            padding="md"
        >
            <div className="stat-panel-header">
                <span className="stat-panel-title">{title}</span>
                {icon && <div className="stat-panel-icon">{icon}</div>}
            </div>

            <div className="stat-panel-body">
                <h3 className="stat-panel-value">{value}</h3>
            </div>

            {(trend || trendValue) && (
                <div className="stat-panel-footer">
                    <span className={`stat-panel-trend trend-${trend}`}>
                        {trend === 'positive' ? '↑' : trend === 'negative' ? '↓' : '→'} {trendValue}
                    </span>
                    <span className="stat-panel-trend-label">vs last week</span>
                </div>
            )}
        </Card>
    );
};
