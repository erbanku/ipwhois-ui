// Configuration file for ipwhois-ui
// Copy this file to config.js and add your API key if needed

const CONFIG = {
    // Optional: Add your ipwhois.io API key here for higher rate limits
    // Get your API key from: https://ipwhois.io/pricing
    apiKey: '',
    
    // API endpoint (should not need to change)
    apiEndpoint: 'https://ipwhois.app/json/'
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.IPWHOIS_CONFIG = CONFIG;
}
