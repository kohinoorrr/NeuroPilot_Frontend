import React, { useState } from 'react';
import { Card } from '../components/monolab/DataDisplay/Card';
import { Flex } from '../components/monolab/Layout/Flex';
import { Grid } from '../components/monolab/Layout/Grid';
import { Switch } from '../components/monolab/Inputs/Switch';
import { Divider } from '../components/monolab/Layout/Divider';
import { Settings as SettingsIcon, Bell, Activity, Lock, Eye } from 'lucide-react';

export default function Settings() {
    const [settings, setSettings] = useState({
        notifications: true,
        weeklyReport: true,
        aiSuggestions: true,
        distractionFilter: false,
        hardwareAccel: true,
        telemetry: false
    });

    const toggle = (key) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <Flex justify="start" align="center" gap="md" style={{ marginBottom: '2rem' }}>
                <SettingsIcon size={32} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2rem' }}>System Configuration</h1>
            </Flex>

            <Grid columns={1} gap="lg">
                <Card padding="lg">
                    <Flex align="center" gap="sm" style={{ marginBottom: '1.5rem' }}>
                        <Bell color="var(--color-secondary)" />
                        <h2 style={{ fontSize: '1.25rem' }}>Notifications & Alerts</h2>
                    </Flex>

                    <Flex justify="between" align="center" style={{ marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Global Notifications</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Receive alerts for tasks and system updates</div>
                        </div>
                        <Switch checked={settings.notifications} onChange={() => toggle('notifications')} />
                    </Flex>

                    <Divider orientation="horizontal" />

                    <Flex justify="between" align="center">
                        <div>
                            <div style={{ fontWeight: 500 }}>Weekly Digest</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Email summary of productivity and BrainOS growth</div>
                        </div>
                        <Switch checked={settings.weeklyReport} onChange={() => toggle('weeklyReport')} />
                    </Flex>
                </Card>

                <Card padding="lg">
                    <Flex align="center" gap="sm" style={{ marginBottom: '1.5rem' }}>
                        <Activity color="var(--color-accent)" />
                        <h2 style={{ fontSize: '1.25rem' }}>AI Assistant Behavior</h2>
                    </Flex>

                    <Flex justify="between" align="center" style={{ marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Proactive Suggestions</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>AI recommends focus sessions based on calendar</div>
                        </div>
                        <Switch checked={settings.aiSuggestions} onChange={() => toggle('aiSuggestions')} />
                    </Flex>

                    <Divider orientation="horizontal" />

                    <Flex justify="between" align="center">
                        <div>
                            <div style={{ fontWeight: 500 }}>Aggressive Distraction Filter</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Strictly block all external notifications during Focus Mode</div>
                        </div>
                        <Switch checked={settings.distractionFilter} onChange={() => toggle('distractionFilter')} />
                    </Flex>
                </Card>

                <Card padding="lg">
                    <Flex align="center" gap="sm" style={{ marginBottom: '1.5rem' }}>
                        <Lock color="var(--color-danger)" />
                        <h2 style={{ fontSize: '1.25rem' }}>Privacy & Hardware</h2>
                    </Flex>

                    <Flex justify="between" align="center" style={{ marginBottom: '1rem' }}>
                        <div>
                            <div style={{ fontWeight: 500 }}>Hardware Acceleration</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Use GPU for BrainOS canvas rendering</div>
                        </div>
                        <Switch checked={settings.hardwareAccel} onChange={() => toggle('hardwareAccel')} />
                    </Flex>

                    <Divider orientation="horizontal" />

                    <Flex justify="between" align="center">
                        <div>
                            <div style={{ fontWeight: 500 }}>Anonymous Telemetry</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>Send anonymous crash reports to NeuroPilot servers</div>
                        </div>
                        <Switch checked={settings.telemetry} onChange={() => toggle('telemetry')} />
                    </Flex>
                </Card>
            </Grid>
        </div>
    );
}
