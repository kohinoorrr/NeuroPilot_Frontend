import React from 'react';
import { Card } from '../components/monolab/DataDisplay/Card';
import { Flex } from '../components/monolab/Layout/Flex';
import { Grid } from '../components/monolab/Layout/Grid';
import { Avatar } from '../components/monolab/DataDisplay/Avatar';
import { Button } from '../components/monolab/Button/Button';
import { TextInput } from '../components/monolab/Inputs/TextInput';
import { UserCircle, Mail, MapPin, Grid as GridIcon } from 'lucide-react';
import { PROFILE } from '../utils/profile';

export default function Profile() {
    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <Flex justify="start" align="center" gap="md" style={{ marginBottom: '2rem' }}>
                <UserCircle size={32} color="var(--color-primary)" />
                <h1 style={{ fontSize: '2rem' }}>Commander Profile</h1>
            </Flex>

            <Grid columns={3} gap="lg">
                {/* Left column - Avatar & basic info */}
                <div>
                    <Card padding="lg" style={{ textAlign: 'center' }}>
                        <Avatar
                            src={PROFILE.avatar}
                            size="xl"
                            status="online"
                            style={{ width: '120px', height: '120px', margin: '0 auto 1.5rem' }}
                        />
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{PROFILE.name}</h2>
                        <p style={{ color: 'var(--color-text-secondary)', marginBottom: '1.5rem' }}>{PROFILE.role}</p>

                        <Flex direction="column" gap="md" align="center">
                            <Button fullWidth variant="outline">Update Photo</Button>
                            <Button fullWidth variant="ghost" style={{ color: 'var(--color-danger)' }}>Delete Account</Button>
                        </Flex>
                    </Card>
                </div>

                {/* Right column - Form */}
                <div style={{ gridColumn: 'span 2' }}>
                    <Card padding="lg">
                        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>Personal Information</h3>

                        <Grid columns={2} gap="md" style={{ marginBottom: '1.5rem' }}>
                            <TextInput label="First Name" defaultValue="Alex" leftIcon={<UserCircle size={16} />} />
                            <TextInput label="Last Name" defaultValue="Carter" leftIcon={<UserCircle size={16} />} />
                        </Grid>

                        <Grid columns={1} gap="md" style={{ marginBottom: '1.5rem' }}>
                            <TextInput label="Email Address" defaultValue={PROFILE.email} leftIcon={<Mail size={16} />} />
                            <TextInput label="Location" defaultValue={PROFILE.location} leftIcon={<MapPin size={16} />} />
                            <TextInput label="Department" defaultValue={PROFILE.dept} leftIcon={<GridIcon size={16} />} />
                        </Grid>

                        <Flex justify="end" gap="sm" style={{ marginTop: '2rem' }}>
                            <Button variant="ghost">Cancel</Button>
                            <Button variant="primary">Save Changes</Button>
                        </Flex>
                    </Card>
                </div>
            </Grid>
        </div>
    );
}
