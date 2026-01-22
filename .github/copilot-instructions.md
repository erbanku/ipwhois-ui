# ipwhois-ui - Copilot Instructions

## Project Overview

Pure vanilla JavaScript web app for IP/hostname WHOIS lookups using ipwhois.io API. Zero build system, zero frameworks - just HTML, CSS, and ES6+ JavaScript. Optimized for direct browser execution.

## Architecture

### Core Design Philosophy

- **No build tools**: Everything runs directly in browser. No webpack, no bundlers.
- **No frameworks**: Vanilla JavaScript only. No React, Vue, or Angular.
- **Static deployment**: Single-page app deployable to any static host (GitHub Pages, Netlify, Vercel).

### File Structure

```
index.html              # Single entry point, loads Leaflet CDN + local assets
src/js/app.js          # All app logic (DOM, API, map, state management)
src/css/styles.css     # Complete styling with CSS variables for dark mode
src/config.example.js  # Template for optional API key config
```

### Configuration System

Triple-source hierarchy (highest priority first):

1. `window.IPWHOIS_CONFIG` (from `src/config.js` - gitignored)
2. `process.env.*` (Node.js environments only, not used in browser)
3. Defaults (free tier API endpoint)

**Never commit API keys**: Both `src/config.js` and `.env` are gitignored. Use `setup.ps1` to initialize config files from templates.

## Development Patterns

### Code Style

- **CSS Variables**: All colors, spacing, shadows defined in `:root` with dark mode overrides in `@media (prefers-color-scheme: dark)`
- **Function naming**: Verb-first (`displayResults`, `formatLocation`, `updateMap`)
- **No classes**: Functional style with module-level state variables (`map`, `marker`)
- **DOM updates**: Direct element manipulation via `getElementById`, no virtual DOM

### Map Integration (Leaflet)

- Single map instance stored in `map` variable, reused across lookups
- Markers are replaced, not accumulated: `map.removeLayer(marker)` before adding new
- Adaptive zoom levels: city (12), region (8), country (6)
- CDN loaded: `<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>`

### API Integration

```javascript
// URL format: https://ipwhois.app/json/{ip}?key={apiKey}
// Empty IP = auto-detect user's IP
// Hostname resolution supported (e.g., "google.com")
```

### URL Parameters

App reads `?ip=`, `?host=`, or `?q=` on load. Updates URL via `history.pushState()` after successful lookups (no page reload).

### Error Handling

Three-state UI: loading spinner, error banner, or results display. Always hide all states before showing next.

## Development Workflows

### Setup

```powershell
# Run PowerShell setup script
./setup.ps1  # Creates src/config.js and .env from templates
```

### Local Testing

```bash
# No build needed - serve static files
python -m http.server 8000
# or
npx serve
# Open http://localhost:8000
```

### Deployment

Direct upload to any static host. No build step required. For API keys in production:

- **Netlify/Vercel**: Use platform environment variables + injection
- **GitHub Pages**: Use `src/config.js` (must be manually created on server)

## Common Tasks

### Adding New Data Fields

1. Add API field to `displayResults()` (app.js L110-125)
2. Add HTML element to [index.html](index.html#L77-L98) details section
3. Formatter functions follow pattern: `formatTimezone()`, `formatCurrency()`

### Styling Changes

All styles in single file [src/css/styles.css](src/css/styles.css). Use existing CSS variables:

- Colors: `--primary-color`, `--text-secondary`, `--card-bg`
- Spacing: `--radius-md`, `--shadow-lg`
- Dark mode: automatically applies via `@media (prefers-color-scheme: dark)`

### Map Customization

Map code in `updateMap()` function (app.js L189-227). Uses OpenStreetMap tiles. To change tiles, modify `L.tileLayer()` URL.

## Critical Conventions

### DOM Element Naming

IDs use camelCase: `ipInput`, `searchBtn`, `rawData`. Match JavaScript variable names.

### Config Priority

When adding config options, always follow the hierarchy:

```javascript
const value = window.IPWHOIS_CONFIG?.key || process.env?.KEY || "default";
```

### Dark Mode

Never hardcode colors. Always use CSS variables. Test both light/dark modes by toggling system preferences.

### Security

API keys must never appear in:

- Git commits
- Client-side rendered HTML
- Browser console logs (except sanitized "Using API key" message)

## Debugging

### Check API Response

Raw JSON visible in UI under "Raw Response" section (collapsible). Clipboard copy available.

### Common Issues

- **Map not loading**: Check Leaflet CDN in [index.html](index.html#L8) head section
- **API rate limit**: Free tier = 10k/month. Add API key to `src/config.js` for higher limits
- **Dark mode not working**: Verify CSS variables in `:root` vs dark mode override

## Dependencies

External (CDN only):

- Leaflet 1.9.4 (maps) - CSS + JS loaded from unpkg.com
- OpenStreetMap tiles
- ipwhois.io flag SVGs (via `cdn.ipwhois.io/flags/`)

No npm dependencies. No package.json.
