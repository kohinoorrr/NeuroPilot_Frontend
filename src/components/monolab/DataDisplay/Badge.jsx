import React from 'react';
import clsx from 'clsx';
import './Badge.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Badge = ({
    children,
    variant = 'default', // default, primary, success, warning, danger
    size = 'md', // sm, md
    className
}) => {
    useTrackComponent('Badge', 'Data Display', 'Global', 'Status or label indicator');

    const classes = clsx(
        'monolab-badge',
        `monolab-badge-${variant}`,
        `monolab-badge-${size}`,
        className
    );

    return (
        <span className={classes}>
            {children}
        </span>
    );
};
