// ComponentTracker.js
import { useEffect } from 'react';

// A simple module to track Monolab UI component usage throughout the app.
// Since React components render multiple times, we'll store instances in a Set/Map globally for the session.

class ComponentTrackerSystem {
    constructor() {
        this.usage = {};
    }

    /**
     * Register a component usage
     * @param {string} name - Component Name (e.g. "Button")
     * @param {string} category - Category (e.g. "Inputs & Controls")
     * @param {string} page - Where it is used (e.g. "MainDashboard" or "Global")
     * @param {string} purpose - What it does
     */
    track(name, category, page = 'Global', purpose = '') {
        if (!this.usage[name]) {
            this.usage[name] = {
                name,
                category,
                instances: [],
                totalCount: 0
            };
        }

        // We don't want to track every single render if it overwhelms,
        // but for the sake of the hackathon report, tracking unique pages/purposes per component is good.
        const instanceKey = `${page}-${purpose}`;
        const exists = this.usage[name].instances.find(i => i.page === page && i.purpose === purpose);

        if (!exists) {
            this.usage[name].instances.push({ page, purpose });
        }

        // Increment total rendered count (approximate since React double-renders in StrictMode, but good enough for demo)
        this.usage[name].totalCount += 1;
    }

    getReport() {
        const components = Object.values(this.usage);
        const uniqueCount = components.length;
        const totalInstances = components.reduce((acc, comp) => acc + comp.totalCount, 0);

        // Group by category
        const grouped = components.reduce((acc, comp) => {
            if (!acc[comp.category]) acc[comp.category] = [];
            acc[comp.category].push(comp);
            return acc;
        }, {});

        return {
            uniqueCount,
            totalInstances,
            components,
            grouped
        };
    }
}

export const ComponentTracker = new ComponentTrackerSystem();

// Hook for easier tracking in functional components
export function useTrackComponent(name, category, page, purpose) {
    useEffect(() => {
        ComponentTracker.track(name, category, page, purpose);
    }, [name, category, page, purpose]);
}
