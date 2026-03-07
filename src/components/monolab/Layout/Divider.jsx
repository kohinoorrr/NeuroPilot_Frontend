import React from 'react';
import clsx from 'clsx';
import './Divider.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Divider = ({
    orientation = 'horizontal', // horizontal, vertical
    variant = 'default', // default, neon
    className,
    ...props
}) => {
    useTrackComponent('Divider', 'Layout & Structure', 'Global', 'Visual separator');

    const classes = clsx(
        'monolab-divider',
        `monolab-divider-${orientation}`,
        `monolab-divider-${variant}`,
        className
    );

    return <div className={classes} role="separator" {...props} />;
};
