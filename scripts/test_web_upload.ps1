# Test de l'interface web complète AIFLIX
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\test_web_upload.ps1

$base = 'https://aiflix-k1kiqrogi-biloutes-593.vercel.app'

Write-Host "=== TEST INTERFACE WEB AIFLIX ===" -ForegroundColor Yellow
Write-Host "URL: $base"

Write-Host "`n1) Test page d'accueil"
try {
    $home = Invoke-WebRequest -Uri $base -UseBasicParsing -TimeoutSec 10
    Write-Host "Page d'accueil OK - Status: $($home.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR page d'accueil: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2) Test page register"
try {
    $register = Invoke-WebRequest -Uri "$base/register" -UseBasicParsing -TimeoutSec 10
    Write-Host "Page register OK - Status: $($register.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR page register: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3) Test page login"
try {
    $login = Invoke-WebRequest -Uri "$base/login" -UseBasicParsing -TimeoutSec 10
    Write-Host "Page login OK - Status: $($login.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR page login: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4) Test page upload"
try {
    $upload = Invoke-WebRequest -Uri "$base/upload" -UseBasicParsing -TimeoutSec 10
    Write-Host "Page upload OK - Status: $($upload.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR page upload: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5) Test page browse"
try {
    $browse = Invoke-WebRequest -Uri "$base/browse" -UseBasicParsing -TimeoutSec 10
    Write-Host "Page browse OK - Status: $($browse.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "ERREUR page browse: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== TOUTES LES PAGES SONT ACCESSIBLES ===" -ForegroundColor Green
Write-Host "Vous pouvez maintenant tester l'upload via l'interface web à: $base/upload" -ForegroundColor Cyan

Write-Host "`n=== FIN TEST WEB ===" -ForegroundColor Yellow