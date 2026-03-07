import React from 'react';
import { Card } from '../components/monolab/DataDisplay/Card';
import { Flex } from '../components/monolab/Layout/Flex';
import { Grid } from '../components/monolab/Layout/Grid';
import { Table } from '../components/monolab/DataDisplay/Table';
import { Tabs } from '../components/monolab/Navigation/Tabs';
import { Badge } from '../components/monolab/DataDisplay/Badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart2 } from 'lucide-react';

const productivityData = [
    { name: 'Mon', score: 82, focus: 120 },
    { name: 'Tue', score: 90, focus: 150 },
    { name: 'Wed', score: 85, focus: 110 },
    { name: 'Thu', score: 94, focus: 210 },
    { name: 'Fri', score: 88, focus: 180 },
    { name: 'Sat', score: 65, focus: 45 },
    { name: 'Sun', score: 100, focus: 300 },
];

const activityLog = [
    { id: 1, action: 'Completed "System Design Docs"', duration: '1h 45m', impact: '+15 Score', time: '10:00 AM' },
    { id: 2, action: 'Focus Mode: UI Refactoring', duration: '2h 15m', impact: '+22 Score', time: '1:30 PM' },
    { id: 3, action: 'Read 2 articles on AI models', duration: '45m', impact: '+8 Score', time: '4:00 PM' },
    { id: 4, action: 'Daily Review', duration: '15m', impact: '+5 Score', time: '6:00 PM' },
];

const columns = [
    { key: 'time', header: 'Time' },
    { key: 'action', header: 'Activity' },
    { key: 'duration', header: 'Duration' },
    { key: 'impact', header: 'Impact', align: 'right' },
];

export default function InsightsAnalytics() {
    const customTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <Card variant="default" padding="sm" style={{ backgroundColor: 'rgba(20, 20, 31, 0.9)', border: '1px solid var(--color-primary)' }}>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>{label}</p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, fontSize: '0.85rem' }}>
                            {entry.name}: {entry.value}
                        </p>
                    ))}
                </Card>
            );
        }
        return null;
    };

    const chartTab = (
        <Card variant="elevated" padding="md" style={{ height: '400px' }}>
            <Flex justify="between" style={{ marginBottom: '1rem' }}>
                <h3>Weekly Productivity Trend</h3>
                <Badge variant="success">+12% vs last week</Badge>
            </Flex>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={productivityData}>
                    <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                    <XAxis dataKey="name" stroke="var(--color-text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <YAxis stroke="var(--color-text-secondary)" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                    <RechartsTooltip content={customTooltip} />
                    <Area type="monotone" dataKey="score" stroke="var(--color-primary)" fillOpacity={1} fill="url(#colorScore)" name="Productivity Score" strokeWidth={2} />
                    <Area type="monotone" dataKey="focus" stroke="var(--color-secondary)" fillOpacity={1} fill="url(#colorFocus)" name="Focus Mins" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <Flex justify="start" align="center" gap="md" style={{ marginBottom: '2rem' }}>
                <BarChart2 size={32} color="var(--color-secondary)" />
                <h1 style={{ fontSize: '2rem' }}>Insights & Analytics</h1>
            </Flex>

            <Grid columns={1} gap="lg">
                <Tabs
                    variant="pill"
                    tabs={[
                        { id: 'trends', label: 'Productivity Trends', content: chartTab },
                        { id: 'focus_stats', label: 'Focus Statistics', content: <Card padding="lg">More advanced focus analytics could go here.</Card> }
                    ]}
                />

                <div style={{ marginTop: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Today's Activity Log</h2>
                    <Table columns={columns} data={activityLog} hoverable striped />
                </div>
            </Grid>
        </div>
    );
}
