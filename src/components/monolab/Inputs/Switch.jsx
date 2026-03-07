import React from 'react';
import clsx from 'clsx';
import './Switch.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Switch = ({
    checked,
    onChange,
    disabled,
    label,
    className,
    id
}) => {
    useTrackComponent('Switch', 'Inputs & Controls', 'Global', 'Toggle switch control');

    const switchId = id || React.useId();

    return (
        <div className={clsx('monolab-switch-wrapper', disabled && 'monolab-switch-disabled', className)}>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                id={switchId}
                disabled={disabled}
                onClick={() => onChange(!checked)}
                className={clsx('monolab-switch', checked && 'monolab-switch-checked')}
            >
                <span className="monolab-switch-thumb" />
            </button>
            {label && <label htmlFor={switchId} className="monolab-switch-label">{label}</label>}
        </div>
    );
};
