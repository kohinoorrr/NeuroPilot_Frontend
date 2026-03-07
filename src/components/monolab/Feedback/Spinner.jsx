import React from 'react';
import clsx from 'clsx';
import './Spinner.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Spinner = ({
    size = 'md', // sm, md, lg
    color = 'primary', // primary, secondary, white
    className
}) => {
    useTrackComponent('Spinner', 'Feedback & Status', 'Global', 'Loading indicator');

    const classes = clsx(
        'monolab-spinner',
        `monolab-spinner-${size}`,
        `monolab-spinner-${color}`,
        className
    );

    return (
        <div className={classes} role="status" aria-label="Loading">
            <div className="monolab-spinner-ring"></div>
            <div className="monolab-spinner-ring"></div>
            <div className="monolab-spinner-ring"></div>
            <div className="monolab-spinner-ring"></div>
        </div>
    );
};
