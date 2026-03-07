import React, { forwardRef } from 'react';
import clsx from 'clsx';
import './TextInput.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const TextInput = forwardRef(({
    label,
    error,
    leftIcon,
    rightIcon,
    className,
    fullWidth = true,
    ...props
}, ref) => {
    useTrackComponent('TextInput', 'Inputs & Controls', 'Global', 'Standard text input field');

    return (
        <div className={clsx('monolab-input-wrapper', fullWidth && 'w-full', className)}>
            {label && <label className="monolab-input-label">{label}</label>}

            <div className="monolab-input-container">
                {leftIcon && <span className="monolab-input-icon-left">{leftIcon}</span>}

                <input
                    ref={ref}
                    className={clsx(
                        'monolab-input-field',
                        leftIcon && 'has-left-icon',
                        rightIcon && 'has-right-icon',
                        error && 'monolab-input-error'
                    )}
                    {...props}
                />

                {rightIcon && <span className="monolab-input-icon-right">{rightIcon}</span>}
            </div>

            {error && <span className="monolab-input-error-msg">{error}</span>}
        </div>
    );
});

TextInput.displayName = 'TextInput';
