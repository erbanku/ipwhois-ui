# ipwhois-ui

A clean, modern web interface for visualizing IP and hostname information using the [ipwhois.io API](https://ipwhois.io).

## Features

- 🔍 **IP Lookup**: Search for any IP address or hostname
- 🌍 **Auto-Detection**: Automatically detects and displays your IP on page load
- 📍 **Map Visualization**: Shows location on OpenStreetMap
- 📊 **Detailed Information**: ISP, organization, location, timezone, currency, and more
- 🔗 **Direct Links**: Support for URL parameters (e.g., `?ip=8.8.8.8`)
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, Apple-inspired design with smooth animations
- 🌙 **Dark Mode**: Automatic dark mode support based on system preferences
- 📋 **Copy JSON**: Easy copy-to-clipboard for raw API responses
- 🔑 **Optional API Key**: Support for ipwhois.io API keys for higher rate limits

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

### Option 1: Open Directly

Simply open `index.html` in your web browser. No build process or server required!

### Option 2: Run with Local Server

For better development experience, use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js (npx)
npx serve

# Using PHP
php -S localhost:8000
```

Then open `http://localhost:8000` in your browser.

## Usage

### Basic Usage

1. Open the website
2. Your IP information will be automatically displayed
3. To look up a different IP or hostname, enter it in the search box and click "Lookup"

### URL Parameters

You can directly link to specific IPs or hostnames:

- `?ip=8.8.8.8` - Look up a specific IP
- `?host=google.com` - Look up a hostname
- `?q=1.1.1.1` - Alternative query parameter

Examples:

- `https://yourdomain.com/?ip=8.8.8.8`
- `https://yourdomain.com/?host=github.com`

### API Key Configuration (Optional)

For higher rate limits, you can configure your ipwhois.io API key in multiple ways:

#### Option 1: Using config.js (Recommended for Development)

1. Copy the example config file:

    ```bash
    cp src/config.example.js src/config.js
    ```

2. Edit `src/config.js` and add your API key:

    ```javascript
    window.IPWHOIS_CONFIG = {
        apiKey: "your-api-key-here",
        apiEndpoint: "https://ipwhois.app/json/",
    };
    ```

#### Option 2: Using Environment Variables (Production)

For production deployments, use environment variables:

1. Copy the example environment file:

    ```bash
    cp .env.example .env
    ```

2. Edit `.env` and add your configuration:

    ```bash
    IPWHOIS_API_KEY=your-api-key-here
    IPWHOIS_API_ENDPOINT=https://ipwhois.app/json/
    ```

3. The application will automatically read from:
    - `window.IPWHOIS_CONFIG` (highest priority)
    - `process.env.IPWHOIS_API_KEY` (for Node.js environments)
    - Default values (free tier)

**Note**: Get your API key from [ipwhois.io pricing page](https://ipwhois.io/pricing)

**Security**: Both `src/config.js` and `.env` files are ignored by git to keep your API key private.

## Technology Stack

- **HTML5**: Semantic markup with clean structure
- **CSS3**: Modern Apple-inspired styling with CSS Grid, Flexbox, and dark mode
- **Vanilla JavaScript**: No frameworks - pure ES6+ JavaScript
- **Leaflet.js**: Interactive maps powered by OpenStreetMap
- **ipwhois.io API**: Comprehensive IP geolocation data

## API Information

This project uses the [ipwhois.io API](https://ipwhois.io/documentation).

- **Free tier**: 10,000 requests per month
- **Endpoint**: `https://ipwhois.app/json/{ip}`
- **Documentation**: https://ipwhois.io/documentation

## Deployment

### GitHub Pages

1. Push your code to GitHub
2. Go to Settings > Pages
3. Select your branch and root directory
4. Your site will be live at `https://yourusername.github.io/ipwhois-ui/`

### Netlify

1. Connect your GitHub repository
2. Set build command: (none)
3. Set publish directory: `/`
4. Deploy!

For API key configuration with environment variables:

- Add `IPWHOIS_API_KEY` as an environment variable in Netlify
- Create a `netlify.toml` file to inject it into the build

### Vercel

1. Import your GitHub repository
2. No build configuration needed
3. Deploy!

### Traditional Web Hosting

Simply upload all files to your web server via FTP or file manager.

## Browser Support

- Chrome/Edge (last 2 versions)
- Firefox (last 2 versions)
- Safari (last 2 versions)
- Mobile browsers (iOS Safari, Chrome Android)

## License

MIT License - See [LICENSE](LICENSE) file for details

## Credits

- IP data provided by [ipwhois.io](https://ipwhois.io)
- Maps powered by [OpenStreetMap](https://www.openstreetmap.org)
- Map library: [Leaflet](https://leafletjs.com)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For API-related issues, please contact [ipwhois.io support](https://ipwhois.io/contact).

For website issues, please open an issue on GitHub.
