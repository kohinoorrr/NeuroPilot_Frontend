import React, { useState } from 'react';
import { Flex } from '../components/monolab/Layout/Flex';
import { Grid } from '../components/monolab/Layout/Grid';
import { Card } from '../components/monolab/DataDisplay/Card';
import { Button } from '../components/monolab/Button/Button';
import { IconButton } from '../components/monolab/Button/IconButton';
import { Badge } from '../components/monolab/DataDisplay/Badge';
import { Avatar } from '../components/monolab/DataDisplay/Avatar';
import { Switch } from '../components/monolab/Inputs/Switch';
import { TextInput } from '../components/monolab/Inputs/TextInput';
import { ProgressBar } from '../components/monolab/Feedback/ProgressBar';
import { Spinner } from '../components/monolab/Feedback/Spinner';
import { StatPanel } from '../components/monolab/DataDisplay/StatPanel';
import { Brain, Star, Settings, User, Bell } from 'lucide-react';

export default function MonolabShowcase() {
    const [switchVal, setSwitchVal] = useState(false);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '4rem', maxWidth: '1200px', margin: '0 auto' }}>
            <Flex justify="start" align="center" gap="md" style={{ marginBottom: '3rem' }}>
                <Brain size={40} color="var(--color-primary)" />
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.25rem' }}>Monolab UI</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.1rem' }}>The premium component system powering NeuroPilot.</p>
                </div>
            </Flex>

            <Grid columns={1} gap="xl">
                {/* 
                    BUTTONS & CONTROLS SECTION 
                    Showcases standard actionable elements.
                */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Buttons & Controls</h2>

                    {/* The Card component provides the glassmorphic background container */}
                    <Card padding="lg">

                        {/* Flex handles inline spacing of the standard Buttons */}
                        <Flex gap="md" align="center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <Button variant="primary">Primary Action</Button>
                            <Button variant="secondary">Secondary</Button>
                            <Button variant="outline">Outline</Button>
                            <Button variant="ghost">Ghost Button</Button>
                            <Button variant="danger">Danger Zone</Button>
                        </Flex>
                        <Flex gap="md" align="center" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                            <Button variant="neon" leftIcon={<Star size={16} />}>Neon Glow</Button>
                            <Button variant="primary" loading>Loading...</Button>
                            <Button variant="outline" disabled>Disabled</Button>
                        </Flex>
                        <Flex gap="md" align="center">
                            <IconButton icon={<Settings size={20} />} variant="primary" />
                            <IconButton icon={<User size={20} />} variant="secondary" />
                            <IconButton icon={<Bell size={20} />} variant="ghost" />
                        </Flex>
                    </Card>
                </section>

                {/* 
                    DATA DISPLAY SECTION 
                    Showcases components used for representing data state visually.
                */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Data Display</h2>

                    {/* Splits the display components into two columns on desktop */}
                    <Grid columns={2} gap="lg">

                        {/* Elevated card with a subtle hover float ('clickable') */}
                        <Card padding="lg" variant="elevated" className="monolab-card-clickable">
                            <h3 style={{ marginBottom: '1rem' }}>Avatars & Badges</h3>

                            {/* Avatars showing different sizes and online statuses */}
                            <Flex gap="md" align="center" style={{ marginBottom: '1rem' }}>
                                <Avatar src="https://i.pravatar.cc/150?u=1" size="sm" />
                                <Avatar src="https://i.pravatar.cc/150?u=2" size="md" status="online" />
                                <Avatar src="https://i.pravatar.cc/150?u=3" size="lg" status="away" />
                                <Avatar src="https://i.pravatar.cc/150?u=4" size="xl" status="busy" />
                            </Flex>
                            <Flex gap="sm" align="center">
                                <Badge variant="default">Default</Badge>
                                <Badge variant="primary">Primary</Badge>
                                <Badge variant="secondary">Secondary</Badge>
                                <Badge variant="success">Success</Badge>
                                <Badge variant="danger">Danger</Badge>
                            </Flex>
                        </Card>

                        <Flex direction="column" gap="md">
                            <StatPanel title="System Memory" value="32 PB" icon={<Brain size={24} />} glowColor="primary" />
                            <StatPanel title="Neural Links" value="1.4M" icon={<Star size={24} />} glowColor="secondary" />
                        </Flex>
                    </Grid>
                </section>

                {/* 
                    INPUTS & FEEDBACK SECTION 
                    Showcases forms, loading states, and user input elements.
                */}
                <section>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Inputs & Feedback</h2>

                    <Card padding="lg">
                        <Grid columns={2} gap="xl">
                            {/* Left column: TextInputs and the Switch component */}
                            <Flex direction="column" gap="lg">
                                <TextInput label="Commander Alias" defaultValue="Neo" />
                                <TextInput label="Access Code" type="password" defaultValue="hunter2" />
                                <Flex justify="between" align="center">
                                    <span>Toggle Hardware Accel</span>
                                    <Switch checked={switchVal} onChange={() => setSwitchVal(!switchVal)} />
                                </Flex>
                            </Flex>
                            <Flex direction="column" gap="lg" justify="center">
                                <div>
                                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Upload Progress [86%]</div>
                                    <ProgressBar progress={86} color="var(--color-secondary)" animated />
                                </div>
                                <div>
                                    <div style={{ marginBottom: '0.5rem', fontSize: '0.9rem' }}>Neural Sync [42%]</div>
                                    <ProgressBar progress={42} color="var(--color-primary)" />
                                </div>
                                <Flex justify="center" align="center" gap="lg" style={{ marginTop: '1rem' }}>
                                    <Spinner size="md" color="primary" />
                                    <Spinner size="lg" color="secondary" />
                                </Flex>
                            </Flex>
                        </Grid>
                    </Card>
                </section>

            </Grid>
        </div>
    );
}
