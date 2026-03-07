import React, { useEffect, useState } from 'react';
import { ComponentTracker } from '../utils/ComponentTracker';
import { Card } from '../components/monolab/DataDisplay/Card';
import { Grid } from '../components/monolab/Layout/Grid';
import { Flex } from '../components/monolab/Layout/Flex';
import { Table } from '../components/monolab/DataDisplay/Table';
import { Badge } from '../components/monolab/DataDisplay/Badge';
import { StatPanel } from '../components/monolab/DataDisplay/StatPanel';
import { Box, Layers, Component } from 'lucide-react';

export default function ComponentUsageReport() {
    const [report, setReport] = useState(null);

    useEffect(() => {
        // We update the state in useEffect to gather components mounted
        // We add a tiny delay to ensure children mounts are tracked
        const timer = setTimeout(() => {
            setReport(ComponentTracker.getReport());
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    if (!report) return (
        <Flex justify="center" align="center" style={{ height: '50vh' }}>
            <div className="monolab-spinner monolab-spinner-lg monolab-spinner-primary">
                <div className="monolab-spinner-ring"></div>
                <div className="monolab-spinner-ring"></div>
                <div className="monolab-spinner-ring"></div>
                <div className="monolab-spinner-ring"></div>
            </div>
        </Flex>
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '3rem' }}>
            <Flex justify="start" align="center" gap="md" style={{ marginBottom: '2rem' }}>
                <Layers size={32} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2rem' }}>Monolab UI Report</h1>
            </Flex>

            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem', maxWidth: '800px' }}>
                This page automatically tracks every `Monolab UI` component rendered in the application session. Component usage is dynamically aggregated to prove extensive custom component utility for the hackathon criteria.
            </p>

            {/* Top-level statistics displaying tracked usage totals */}
            <Grid columns={3} gap="lg" style={{ marginBottom: '3rem' }}>
                <StatPanel
                    title="Unique Components"
                    value={report.uniqueCount}
                    icon={<Box size={24} />}
                    glowColor="primary"
                />
                <StatPanel
                    title="Total Instances Rendered"
                    value={report.totalInstances}
                    icon={<Layers size={24} />}
                    glowColor="secondary"
                />
                <StatPanel
                    title="UI Categories"
                    value={Object.keys(report.grouped).length}
                    icon={<Component size={24} />}
                    glowColor="accent"
                />
            </Grid>

            {/* Iterates through tracked components grouped by their Category (Layout, Data Display, etc) */}
            {Object.entries(report.grouped).map(([category, components]) => (
                <div key={category} style={{ marginBottom: '3rem' }}>
                    <Flex align="center" gap="sm" style={{ marginBottom: '1rem' }}>
                        <h2 style={{ fontSize: '1.5rem', color: 'var(--color-text-primary)' }}>{category}</h2>
                        <Badge variant="primary">{components.length} Components</Badge>
                    </Flex>

                    {/* Renders a specialized Table component to list each unique component found in this category */}
                    <Card padding="none" variant="elevated">
                        <Table
                            columns={[
                                { key: 'name', header: 'Component Name' },
                                { key: 'contexts', header: 'Used Where' },
                                { key: 'total', header: 'Initial Renders', align: 'center' }
                            ]}
                            data={components.map(comp => ({
                                id: comp.name,
                                name: <strong style={{ color: 'var(--color-primary)' }}>{comp.name}</strong>,
                                contexts: (
                                    <Flex direction="column" gap="sm">
                                        {comp.instances.map((i, idx) => (
                                            <div key={idx} style={{ fontSize: '0.85rem' }}>
                                                <Badge variant="default" size="sm">{i.page}</Badge>
                                                <span style={{ marginLeft: '8px', color: 'var(--color-text-secondary)' }}>{i.purpose}</span>
                                            </div>
                                        ))}
                                    </Flex>
                                ),
                                total: <Badge variant="success">{comp.totalCount}</Badge> // total Count represents renders tracked by effect
                            }))}
                            hoverable
                            striped
                        />
                    </Card>
                </div>
            ))}
        </div>
    );
}
