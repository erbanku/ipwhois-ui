# IP WHOIS Lookup

> A clean, modern web interface for IP and hostname geolocation powered by [ipapi.co](https://ipapi.co)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![No Build Tools](https://img.shields.io/badge/build-none-green.svg)](/)
[![Vanilla JS](https://img.shields.io/badge/javascript-vanilla-yellow.svg)](/)

**[Live Demo →](https://ipwhois.erbanku.com/)**

<img width="2238" height="1555" alt="image" src="https://github.com/user-attachments/assets/5e8b5072-731e-4fff-89c3-996dcef3c160" />

## Features

- **IP & Hostname Lookup** - Search any IPv4 address or domain name
- **Auto-Detection** - Instantly displays your current IP on load
- **Interactive Map** - OpenStreetMap visualization with location markers
- **Detailed Insights** - ISP, organization, location, timezone, currency, ASN
- **URL Parameters** - Direct link support (`?ip=8.8.8.8` or `?host=example.com`)
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Modern UI** - Apple-inspired design with smooth animations
- **Dark Mode** - Automatic theme based on system preferences
- **Copy to Clipboard** - Export raw JSON responses
- **No Build Required** - Pure vanilla JavaScript, runs directly in browser
- **API Key Support** - Optional configuration for higher rate limits

## Project Structure

```
ipwhois-ui/
├── src/
│   ├── css/
│   │   └── styles.css       # All styles with dark mode support
│   ├── js/
│   │   └── app.js          # Main application logic
│   └── config.example.js   # Configuration template
├── index.html              # Main HTML file
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── LICENSE                 # MIT License
└── README.md               # This file
```

## Quick Start

**No installation needed** - Just open [index.html](index.html) in any modern browser.

### Local Development Server

For better development experience with hot reload:

```bash
# Python 3
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

### Using PowerShell Setup Script

```powershell
# Run the setup script to create config files from templates
./setup.ps1
```

This creates `src/config.js` and `.env` from their example files.

## Usage

### Basic Lookup

1. Open the application - your IP is automatically displayed
2. Enter any IP address or hostname in the search box
3. Click **Lookup** or press Enter

### Direct URL Access

Link directly to specific lookups using URL parameters:

| Parameter | Example            | Description             |
| --------- | ------------------ | ----------------------- |
| `?ip=`    | `?ip=8.8.8.8`      | Look up IPv4 address    |
| `?host=`  | `?host=google.com` | Look up hostname        |
| `?q=`     | `?q=1.1.1.1`       | Alternative query param |

**Live Examples:**

- `https://yourdomain.com/?ip=8.8.8.8` - Google DNS
- `https://yourdomain.com/?host=github.com` - GitHub servers

## Configuration

### API Key Setup (Optional)

The app works without an API key (ipapi.co free tier requires no registration). For custom endpoints that require a key:

**Method 1: Local Config File** (Recommended for Development)

```bash
# Copy template
cp src/config.example.js src/config.js

# Edit src/config.js
window.IPWHOIS_CONFIG = {
    apiKey: "your-api-key-here",
    apiEndpoint: "https://ipapi.co/"
};
```

**Method 2: Environment Variables** (Production)

```bash
# Create .env file
cp .env.example .env

# Add your key
IPWHOIS_API_KEY=your-api-key-here
IPWHOIS_API_ENDPOINT=https://ipapi.co/
```

**Configuration Priority:**

1. `window.IPWHOIS_CONFIG` (highest)
2. `process.env.*` variables
3. Default free tier

Get your API key: [ipapi.co](https://ipapi.co)

> Both `src/config.js` and `.env` are gitignored for security.

## Technology Stack

| Technology             | Purpose                         |
| ---------------------- | ------------------------------- |
| **HTML5**              | Semantic markup                 |
| **CSS3**               | Grid/Flexbox layouts, dark mode |
| **Vanilla JavaScript** | ES6+ with no frameworks         |
| **Leaflet.js**         | Interactive maps                |
| **OpenStreetMap**      | Map tiles                       |
| **ipapi.co API**    | IP geolocation data             |

**Why No Frameworks?**

- Zero dependencies
- Fast load times
- No build process
- Deploy anywhere
- Easy to understand

## Deployment

### Static Hosting Platforms

| Platform             | Steps                                     |
| -------------------- | ----------------------------------------- |
| **GitHub Pages**     | Settings → Pages → Select branch → Deploy |
| **Vercel**           | Import repo → Deploy (zero config)        |
| **Netlify**          | Connect repo → Build: none → Publish: `/` |
| **Traditional Host** | Upload via FTP/SFTP                       |

### Environment Variables (Production)

For Netlify/Vercel with API keys:

**Netlify:**

```toml
# netlify.toml
[build.environment]
  IPWHOIS_API_KEY = "your-key"
```

**Vercel:**
Add environment variable in dashboard: `IPWHOIS_API_KEY`

## API Information

**Provider:** [ipapi.co](https://ipapi.co)

| Detail            | Value                                                        |
| ----------------- | ------------------------------------------------------------ |
| **Free Tier**     | Free, no API key required, no registration needed            |
| **Endpoint**      | `https://ipapi.co/{ip}/json/`                                |
| **Documentation** | [ipapi.co](https://ipapi.co)                           |

## Browser Support

| Browser     | Version                    |
| ----------- | -------------------------- |
| Chrome/Edge | Last 2 versions            |
| Firefox     | Last 2 versions            |
| Safari      | Last 2 versions            |
| Mobile      | iOS Safari, Chrome Android |

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## License

[MIT License](LICENSE) - Free to use for personal and commercial projects.

## Credits

- **IP Data** - [IPWHOIS.IO](https://ipwhois.io)
- **Maps** - [OpenStreetMap](https://www.openstreetmap.org) contributors
- **Map Library** - [Leaflet](https://leafletjs.com)
- **Developer** - [erbanku](https://github.com/erbanku)

## Support

- API Issues: [ipapi.co](https://ipapi.co)
- App Issues: [GitHub Issues](../../issues)

---

<p align="center">Made with ❤️ by <a href="https://github.com/erbanku">erbanku</a></p>
<p align="center">© 2026</p>

For website issues, please open an issue on GitHub.
