// Configuration - read from environment variables or external config
// Priority: window.IPWHOIS_CONFIG > environment variables > defaults
const CONFIG = {
    apiKey:
        window.IPWHOIS_CONFIG?.apiKey ||
        (typeof process !== "undefined" && process.env?.IPWHOIS_API_KEY) ||
        "",
    apiEndpoint:
        window.IPWHOIS_CONFIG?.apiEndpoint ||
        (typeof process !== "undefined" && process.env?.IPWHOIS_API_ENDPOINT) ||
        "https://ipwhois.app/json/",
};

// Log config status (without exposing API key)
if (CONFIG.apiKey) {
    console.log("Using API key from configuration");
} else {
    console.log("Running in free tier mode (no API key)");
}

// State
let map = null;
let marker = null;

// DOM Elements
const ipInput = document.getElementById("ipInput");
const searchBtn = document.getElementById("searchBtn");
const resultsDiv = document.getElementById("results");
const errorDiv = document.getElementById("error");
const loadingDiv = document.getElementById("loading");
const copyBtn = document.getElementById("copyBtn");

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
    initializeApp();
});

function initializeApp() {
    // Check for IP/hostname in URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const urlIp =
        urlParams.get("ip") || urlParams.get("host") || urlParams.get("q");

    if (urlIp) {
        ipInput.value = urlIp;
        lookupIP(urlIp);
    } else {
        // Auto-detect user's IP
        lookupIP("");
    }

    // Event listeners
    searchBtn.addEventListener("click", handleSearch);
    ipInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    });
    copyBtn.addEventListener("click", copyJSON);
}

function handleSearch() {
    const input = ipInput.value.trim();
    lookupIP(input);
}

async function lookupIP(ip) {
    try {
        showLoading();
        hideError();
        hideResults();

        // Build API URL
        let apiUrl = CONFIG.apiEndpoint;
        if (ip) {
            apiUrl += ip;
        }
        if (CONFIG.apiKey) {
            apiUrl += `?key=${CONFIG.apiKey}`;
        }

        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success === false) {
            throw new Error(data.message || "Failed to fetch IP information");
        }

        displayResults(data);
        hideLoading();
    } catch (error) {
        hideLoading();
        showError(`Error: ${error.message}`);
        console.error("Lookup error:", error);
    }
}

function displayResults(data) {
    // Update info cards
    document.getElementById("ipAddress").textContent = data.ip || "-";
    document.getElementById("location").textContent = formatLocation(data);
    document.getElementById("isp").textContent = data.isp || "-";
    document.getElementById("org").textContent = data.org || "-";

    // Update detailed information
    document.getElementById("country").textContent = formatCountry(data);
    document.getElementById("region").textContent = data.region || "-";
    document.getElementById("city").textContent = data.city || "-";
    document.getElementById("postal").textContent = data.postal || "-";
    document.getElementById("timezone").textContent = formatTimezone(data);
    document.getElementById("currency").textContent = formatCurrency(data);
    document.getElementById("continent").textContent = data.continent || "-";
    document.getElementById("asn").textContent = data.asn || "-";

    // Update raw JSON
    document.getElementById("rawData").textContent = JSON.stringify(
        data,
        null,
        2,
    );

    // Update map
    if (data.latitude && data.longitude) {
        updateMap(data.latitude, data.longitude, data);
    }

    // Update URL without reloading page
    if (data.ip) {
        const newUrl = `${window.location.pathname}?ip=${encodeURIComponent(data.ip)}`;
        window.history.pushState({ ip: data.ip }, "", newUrl);
    }

    showResults();
}

function formatLocation(data) {
    const parts = [];
    if (data.city) parts.push(data.city);
    if (data.region) parts.push(data.region);
    if (data.country) parts.push(data.country);
    return parts.length > 0 ? parts.join(", ") : "-";
}

function formatCountry(data) {
    if (data.country && data.country_flag) {
        return `${data.country_flag} ${data.country}`;
    }
    return data.country || "-";
}

function formatTimezone(data) {
    if (data.timezone && data.timezone_gmt) {
        return `${data.timezone} (GMT${data.timezone_gmt})`;
    }
    return data.timezone || "-";
}

function formatCurrency(data) {
    if (data.currency && data.currency_code) {
        return `${data.currency} (${data.currency_code})`;
    }
    return data.currency || "-";
}

function updateMap(lat, lng, data) {
    const mapDiv = document.getElementById("map");

    // Initialize map if not already done
    if (!map) {
        map = L.map("map").setView([lat, lng], 10);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);
    } else {
        // Update view to new coordinates
        map.setView([lat, lng], 10);
    }

    // Remove old marker if exists
    if (marker) {
        map.removeLayer(marker);
    }

    // Add new marker
    const popupContent = `
        <div style="text-align: center;">
            <strong>${data.ip}</strong><br>
            ${data.city ? data.city + ", " : ""}${data.country || ""}<br>
            <small>Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</small>
        </div>
    `;

    marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();
}

function showResults() {
    resultsDiv.style.display = "block";
}

function hideResults() {
    resultsDiv.style.display = "none";
}

function showLoading() {
    loadingDiv.style.display = "block";
    searchBtn.disabled = true;
    searchBtn.querySelector(".btn-text").style.display = "none";
    searchBtn.querySelector(".btn-loader").style.display = "inline";
}

function hideLoading() {
    loadingDiv.style.display = "none";
    searchBtn.disabled = false;
    searchBtn.querySelector(".btn-text").style.display = "inline";
    searchBtn.querySelector(".btn-loader").style.display = "none";
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = "block";
}

function hideError() {
    errorDiv.style.display = "none";
}

function copyJSON() {
    const rawData = document.getElementById("rawData").textContent;

    navigator.clipboard
        .writeText(rawData)
        .then(() => {
            // Change button text temporarily
            const originalText = copyBtn.textContent;
            copyBtn.textContent = "✓ Copied!";
            copyBtn.style.background = "#059669";

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = "";
            }, 2000);
        })
        .catch((err) => {
            console.error("Failed to copy:", err);
            alert("Failed to copy to clipboard");
        });
}

// Handle browser back/forward buttons
window.addEventListener("popstate", (event) => {
    if (event.state && event.state.ip) {
        ipInput.value = event.state.ip;
        lookupIP(event.state.ip);
    }
});
