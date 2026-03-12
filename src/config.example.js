// Configuration file for ipwhois-ui
// Copy this file to config.js and add your API key if needed

const CONFIG = {
    // Optional: Add your API key here for higher rate limits
    apiKey: '',
    
    // API endpoint (should not need to change)
    apiEndpoint: 'https://ipwhois.app/json/'
};

// Make config available globally
if (typeof window !== 'undefined') {
    window.IPWHOIS_CONFIG = CONFIG;
}
