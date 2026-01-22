# Development Setup Script
# Run this script to set up your development environment

Write-Host "Setting up ipwhois-ui development environment..." -ForegroundColor Cyan

# Check if config.js exists, if not create from example
if (-not (Test-Path "src/config.js")) {
    if (Test-Path "src/config.example.js") {
        Copy-Item "src/config.example.js" "src/config.js"
        Write-Host "Created src/config.js from example" -ForegroundColor Green
        Write-Host "Please edit src/config.js to add your API key" -ForegroundColor Yellow
    }
}
else {
    Write-Host "src/config.js already exists" -ForegroundColor Green
}

# Check if .env exists
if (-not (Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "Created .env from example" -ForegroundColor Green
        Write-Host "Please edit .env to add your configuration" -ForegroundColor Yellow
    }
}
else {
    Write-Host ".env already exists" -ForegroundColor Green
}

Write-Host "`nSetup complete!" -ForegroundColor Cyan
Write-Host "Run a local server to test:" -ForegroundColor White
Write-Host "  python -m http.server 8000" -ForegroundColor Gray
Write-Host "  or" -ForegroundColor Gray
Write-Host "  npx serve" -ForegroundColor Gray
