import React from 'react';
import clsx from 'clsx';
import './Table.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Table = ({
    columns, // Array of { key, header, align }
    data, // Array of objects matching column keys
    className,
    hoverable = true,
    striped = false
}) => {
    useTrackComponent('Table', 'Data Display', 'Global', 'Data grid for structured information');

    return (
        <div className={clsx('monolab-table-container', className)}>
            <table className={clsx('monolab-table', hoverable && 'table-hover', striped && 'table-striped')}>
                <thead>
                    <tr>
                        {columns.map((col, i) => (
                            <th key={col.key || i} className={`align-${col.align || 'left'}`}>
                                {col.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 ? (
                        <tr>
                            <td colSpan={columns.length} className="text-center py-8">
                                <span className="text-secondary">No data available</span>
                            </td>
                        </tr>
                    ) : (
                        data.map((row, i) => (
                            <tr key={row.id || i}>
                                {columns.map((col, j) => (
                                    <td key={`${row.id || i}-${col.key || j}`} className={`align-${col.align || 'left'}`}>
                                        {row[col.key]}
                                    </td>
                                ))}
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};
