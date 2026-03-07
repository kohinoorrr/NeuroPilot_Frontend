import React from 'react';
import clsx from 'clsx';
import './Button.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const IconButton = ({
    icon,
    variant = 'ghost',
    size = 'md',
    className,
    ...props
}) => {
    useTrackComponent('IconButton', 'Inputs & Controls', 'Global', 'Icon-only button for compact actions');

    const classes = clsx(
        'monolab-btn-icon',
        `monolab-btn-${variant}`,
        `monolab-btn-${size}`,
        className
    );

    return (
        <button className={classes} {...props}>
            {icon}
        </button>
    );
};
