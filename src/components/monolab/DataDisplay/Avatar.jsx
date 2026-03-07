import React from 'react';
import clsx from 'clsx';
import './Avatar.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Avatar = ({
    src,
    alt = 'Avatar',
    size = 'md', // sm, md, lg, xl
    status, // online, offline, busy, away
    className,
    initials,
}) => {
    useTrackComponent('Avatar', 'Data Display', 'Global', 'User profile picture and status indicator');

    const containerClasses = clsx(
        'monolab-avatar',
        `monolab-avatar-${size}`,
        className
    );

    return (
        <div className={containerClasses}>
            {src ? (
                <img src={src} alt={alt} className="monolab-avatar-img" />
            ) : (
                <div className="monolab-avatar-fallback">
                    {initials || alt.charAt(0).toUpperCase()}
                </div>
            )}
            {status && (
                <span className={clsx('monolab-avatar-status', `status-${status}`)} />
            )}
        </div>
    );
};
