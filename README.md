# NeuroPilot | AI Life Command Center

## Table of Contents
- [About](#about)
- [Quick Start (Local Dev)](#quick-start-local-dev)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Key Concepts](#key-concepts)
- [PostHog Integration](#posthog-integration)
- [Responsive / Accessibility Notes](#responsive--accessibility-notes)
- [Common Tasks and Scripts](#common-tasks-and-scripts)
- [Contributing](#contributing)
- [Troubleshooting & FAQ](#troubleshooting--faq)

---

## About
**NeuroPilot** is an AI-driven Life Command Center. It provides an immersive, futuristic interface to manage tasks, focus modes, analytics, and knowledge maps. It features a custom design system called **Monolab**, holographic cursors, grid-flip transitions, and dynamically themed wallpapers, creating a highly interactive and gamified productivity experience.

---

## Quick Start (Local Dev)

This project is built with [Vite](https://vitejs.dev/) and React.

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd NeuroPilot
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Start the development server:**
   ```bash
   npm run dev
   ```
4. **Open your browser:**
   Navigate to [http://localhost:5173/](http://localhost:5173/) to see the app running.

---

## Environment Variables

For the application to function with full tracking and feature flags, ensure you have your environment variables set up. Create a `.env` file in the root directory:

```env
# Example .env file
VITE_POSTHOG_KEY=your_posthog_project_api_key
VITE_POSTHOG_HOST=https://app.posthog.com
```

*Note: Prefix any variables that need to be exposed to the Vite client with `VITE_`.*

---

## Project Structure

Here's an overview of where everything lives:

```text
NeuroPilot/
├── public/                 # Static assets, fonts, uncompiled media
├── src/
│   ├── components/         # Shared global components (Cursor, Nav, JarvisIntro)
│   │   └── monolab/        # The internal design system / component library
│   │       ├── Button/     # Button variants
│   │       ├── DataDisplay/# Cards, avatars, charts
│   │       ├── Feedback/   # Alerts, loaders, tooltips 
│   │       ├── Inputs/     # Text fields, selects, toggles
│   │       ├── Layout/     # Layout shells, containers
│   │       └── Navigation/ # Links, breadcrumbs
│   ├── pages/              # Top-level page components (Dashboard, FocusMode, etc.)
│   ├── styles/             # Global CSS and theme variables
│   ├── utils/              # Utility functions, Context providers (ThemeContext)
│   ├── App.jsx             # Main router and layout shell config
│   └── main.jsx            # Application entry point
├── index.html              # HTML template
├── vite.config.js          # Vite configuration
└── package.json            # Scripts and dependencies
```

---

## Key Concepts

### Component Registry & Monolab
The app uses a custom internal UI toolkit named **Monolab**. Rather than scattering generic UI elements, buttons, inputs, and layout containers are imported directly from `src/components/monolab/`. This ensures visual consistency across the command center.

### Previews & Variants
Monolab components are built with multiple **Variants** (e.g., `primary`, `secondary`, `outline`, `ghost`, or themed 'nebula' styles). You can view and test these variants directly by navigating to the `/monolab-components` (Showcase) or `/monolab-report` (Usage Report) routes in your local environment.

### Grid Flip Transitions
Navigation across top-level views is animated using a custom `<GridFlipTransition>` wrapper, providing a cinematic, seamless entry between screens.

---

## PostHog Integration

We use **PostHog** for product analytics, event tracking, and potentially feature flags. 

**What is tracked:**
- **Page Views:** Automatically tracked when navigating between different routes (Dashboard, Knowledge Map, Focus Mode, etc.).
- **Component Usage:** Interactive elements within Monolab (buttons clicked, modes toggled) may fire custom events to analyze feature adoption.
- **Session Duration:** Time spent in specific modes like "Focus Mode" or the "Component Dodger" game.

**How it is tracked:**
PostHog is initialized centrally (typically in `main.jsx` or a dedicated analytics utility) using the `VITE_POSTHOG_KEY` from your environment variables. Custom events are dispatched via a wrapper hook or directly calling `posthog.capture()`.

---

## Responsive / Accessibility Notes

- **Aesthetics First, Responsive Second:** While primarily tailored for desktop/tablet "Command Center" dashboard views, Monolab components use CSS flexbox/grid for fluid resizing.
- **Accessibility (a11y):** Form inputs and buttons use standard ARIA tags where appropriate. The holographic cursor is purely visual (pointer-events-none) and does not interfere with screen readers or native keyboard focus states.
- **Theme Contrast:** The active theme (e.g., `nebula`, `cyberpunk`) dictates color variables. Ensure that if adding new themes, text contrast ratios remain legible.

---

## Common Tasks and Scripts

- `npm run dev`: Starts the local Vite dev server.
- `npm run build`: Compiles and bundles the application for production into the `dist/` folder.
- `npm run preview`: Bootstraps a local web server to serve the production `dist/` folder for testing.

---

## Contributing

1. **Branch Naming:** Use feature branches (`feature/add-new-card`, `fix/navbar-glitch`).
2. **Component Rules:** If you are adding a reusable UI element, place it in `src/components/monolab/` and ensure it accepts standard props (`className`, `variant`, `size`).
3. **Commit Messages:** Keep them descriptive and concise (e.g., `feat: integrate PostHog tracking on Insight Dashboard`).

---

## Troubleshooting & FAQ

**Q: I'm seeing a blank screen or a "GridFlipTransition" error on load.**
A: Ensure your browser supports standard React 18 concurrent features and check the console for missing video assets used by `<ThemeWallpaper>`.

**Q: The custom cursors or animations are lagging.**
A: The `<HolographicCursor>` uses `requestAnimationFrame`. If you experience poor performance, ensure hardware acceleration is enabled in your browser, or temporarily disable global animations in the Settings page.

**Q: Where do the holographic transitions come from?**
A: They are managed by `GridFlipTransition.jsx` and pure CSS animations defined in `Layout.css` / global stylesheets.

**Q: PostHog events aren't firing locally.**
A: Make sure you've created a `.env` file with a valid `VITE_POSTHOG_KEY`. Ad blockers (like uBlock Origin or Brave Shields) may also block PostHog tracking scripts locally.
