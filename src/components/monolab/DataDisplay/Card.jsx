import React from 'react';
import clsx from 'clsx';
import './Card.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Card = ({
    children,
    className,
    variant = 'default', // default, elevated, neon
    padding = 'md', // none, sm, md, lg
    onClick,
    ...props
}) => {
    useTrackComponent('Card', 'Data Display', 'Global', 'Content container with glassmorphism style');

    const classes = clsx(
        'monolab-card',
        `monolab-card-${variant}`,
        `monolab-card-p-${padding}`,
        onClick && 'monolab-card-clickable',
        className
    );

    return (
        <div className={classes} onClick={onClick} {...props}>
            {children}
        </div>
    );
};
