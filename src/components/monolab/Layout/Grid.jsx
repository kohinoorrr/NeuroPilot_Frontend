import React from 'react';
import clsx from 'clsx';
import './Grid.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Grid = ({
    children,
    columns = 1, // 1, 2, 3, 4, 12, etc. (we'll support common ones)
    gap = 'md', // sm, md, lg
    className,
    ...props
}) => {
    useTrackComponent('Grid', 'Layout & Structure', 'Global', 'CSS Grid container layout');

    const classes = clsx(
        'monolab-grid',
        `monolab-grid-cols-${columns}`,
        `monolab-grid-gap-${gap}`,
        className
    );

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};
