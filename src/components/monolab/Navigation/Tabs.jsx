import React, { useState } from 'react';
import clsx from 'clsx';
import './Tabs.css';
import { useTrackComponent } from '../../../utils/ComponentTracker';

export const Tabs = ({
    tabs = [], // { id, label, icon, content }
    defaultTab,
    className,
    variant = 'line' // line, pill
}) => {
    useTrackComponent('Tabs', 'Navigation', 'Global', 'Tabbed content switcher');

    const [activeTab, setActiveTab] = useState(defaultTab || (tabs.length > 0 ? tabs[0].id : null));

    const activeContent = tabs.find(t => t.id === activeTab)?.content;

    return (
        <div className={clsx('monolab-tabs', className)}>
            <div className={clsx('monolab-tab-list', `variant-${variant}`)} role="tablist">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        role="tab"
                        aria-selected={activeTab === tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={clsx('monolab-tab-btn', activeTab === tab.id && 'active')}
                    >
                        {tab.icon && <span className="monolab-tab-icon">{tab.icon}</span>}
                        <span className="monolab-tab-label">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="monolab-tab-panels" role="tabpanel">
                <div className="animate-fade-in" key={activeTab}>
                    {activeContent}
                </div>
            </div>
        </div>
    );
};
