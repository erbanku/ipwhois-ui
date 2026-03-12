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
        // Check if this is a refresh (URL was already processed)
        const currentUrl = window.location.href;
        const lastUrl = sessionStorage.getItem("lastProcessedUrl");

        if (lastUrl === currentUrl) {
            // This is a refresh, redirect to homepage
            sessionStorage.removeItem("lastProcessedUrl");
            window.location.href = window.location.pathname;
            return;
        }

        // Store URL for refresh detection
        sessionStorage.setItem("lastProcessedUrl", currentUrl);

        ipInput.value = urlIp;
        lookupIP(urlIp);
    } else {
        // Clear URL on homepage/refresh
        if (window.location.search) {
            window.history.replaceState({}, "", window.location.pathname);
        }
        // Clear session storage
        sessionStorage.removeItem("lastProcessedUrl");
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

    // Update flag separately for location card
    const locationCard = document.querySelector(".info-card:first-child");
    let flagImg = locationCard.querySelector(".card-flag");
    if (data.country_code) {
        const flagUrl = `https://cdn.ipwhois.io/flags/${data.country_code.toLowerCase()}.svg`;
        if (!flagImg) {
            flagImg = document.createElement("img");
            flagImg.className = "card-flag";
            locationCard.querySelector(".card-header").appendChild(flagImg);
        }
        flagImg.src = flagUrl;
        flagImg.alt = data.country || "";
    } else if (flagImg) {
        flagImg.remove();
    }

    // Update detailed information
    document.getElementById("country").textContent = formatCountry(data);
    document.getElementById("region").textContent = data.region || "-";
    document.getElementById("city").textContent = data.city || "-";
    document.getElementById("timezone").textContent = formatTimezone(data);
    document.getElementById("currency").textContent = formatCurrency(data);
    document.getElementById("currencyRates").textContent =
        formatCurrencyRates(data);
    document.getElementById("continent").textContent = data.continent || "-";
    document.getElementById("asn").textContent = formatAsn(data);

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
    // Only add region if it's different from city
    if (data.region && data.region !== data.city) parts.push(data.region);
    // Add country without flag
    if (data.country) {
        parts.push(data.country);
    }
    return parts.length > 0 ? parts.join(", ") : "-";
}

function formatCountry(data) {
    // Return country name only, flag will be displayed separately
    return data.country || "-";
}

function formatTimezone(data) {
    const tz = data.timezone?.id;
    const gmt = data.timezone?.utc;
    if (tz && gmt) {
        return `${tz} (GMT${gmt})`;
    }
    return tz || "-";
}

function formatCurrency(data) {
    const name = data.currency?.name;
    const code = data.currency?.code;
    if (name && code) {
        return `${name} (${code})`;
    }
    return name || "-";
}

function formatCurrencyRates(data) {
    const rate = data.currency?.exchange_rate;
    const code = data.currency?.code;
    if (rate && code) {
        return `1 USD = ${rate} ${code}`;
    }
    return "-";
}

function formatAsn(data) {
    return data.asn || "-";
}

function updateMap(lat, lng, data) {
    const mapDiv = document.getElementById("map");

    // Determine appropriate zoom level based on location specificity
    let zoomLevel = 6; // Default: country level
    if (data.city && data.city !== "-") {
        zoomLevel = 12; // City level
    } else if (data.region && data.region !== "-") {
        zoomLevel = 8; // Region level
    }

    // Initialize map if not already done
    if (!map) {
        map = L.map("map").setView([lat, lng], zoomLevel);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
                '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
        }).addTo(map);
    } else {
        // Update view to new coordinates
        map.setView([lat, lng], zoomLevel);
    }

    // Remove old marker if exists
    if (marker) {
        map.removeLayer(marker);
    }

    // Add new marker
    const popupContent = `
        <div style="min-width: 200px; padding: 4px;">
            <div style="font-size: 1rem; font-weight: 700; margin-bottom: 6px; color: var(--text-primary);">${data.ip}</div>
            <div style="font-size: 0.9375rem; margin-bottom: 4px; color: var(--text-primary);">${data.city ? data.city + ", " : ""}${data.country || ""}</div>
            <div style="font-size: 0.8125rem; color: var(--text-secondary);">Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}</div>
        </div>
    `;

    marker = L.marker([lat, lng])
        .addTo(map)
        .bindPopup(popupContent, {
            closeButton: false,
            minWidth: 200,
            maxWidth: 300,
            className: "custom-popup",
        })
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
            copyBtn.textContent = "Copied!";
            copyBtn.style.background = "var(--success-color)";
            copyBtn.style.transform = "scale(1.05)";

            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = "";
                copyBtn.style.transform = "";
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
