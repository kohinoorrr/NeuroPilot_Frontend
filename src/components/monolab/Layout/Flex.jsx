import React from 'react';
import clsx from 'clsx';
import './Flex.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Flex = ({
    children,
    direction = 'row', // row, column
    align = 'center', // start, center, end, stretch
    justify = 'start', // start, center, end, between, around
    gap = 'md', // none, sm, md, lg
    wrap = false,
    className,
    ...props
}) => {
    useTrackComponent('Flex', 'Layout & Structure', 'Global', 'Flexbox container layout');

    const classes = clsx(
        'monolab-flex',
        `monolab-flex-dir-${direction}`,
        `monolab-flex-align-${align}`,
        `monolab-flex-justify-${justify}`,
        `monolab-flex-gap-${gap}`,
        wrap && 'monolab-flex-wrap',
        className
    );

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};
