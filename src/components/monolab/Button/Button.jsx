import React from 'react';
import clsx from 'clsx';
import './Button.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Button = ({
    children,
    variant = 'primary', // primary, secondary, outline, ghost, danger
    size = 'md', // sm, md, lg
    className,
    fullWidth,
    leftIcon,
    rightIcon,
    isLoading,
    ...props
}) => {
    useTrackComponent('Button', 'Inputs & Controls', 'Global', 'Standard button for user actions');

    const classes = clsx(
        'monolab-btn',
        `monolab-btn-${variant}`,
        `monolab-btn-${size}`,
        fullWidth && 'monolab-btn-full',
        isLoading && 'monolab-btn-loading',
        className
    );

    return (
        <button className={classes} disabled={isLoading || props.disabled} {...props}>
            {isLoading ? (
                <span className="monolab-btn-spinner" />
            ) : leftIcon ? (
                <span className="monolab-btn-icon-left">{leftIcon}</span>
            ) : null}

            <span className="monolab-btn-text">{children}</span>

            {!isLoading && rightIcon && (
                <span className="monolab-btn-icon-right">{rightIcon}</span>
            )}
        </button>
    );
};
