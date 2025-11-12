# Script de diagnostic complet pour les uploads AIFLIX
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\debug_upload.ps1

$base = 'https://aiflix-e64r9c7i9-biloutes-593.vercel.app'

Write-Host "=== DIAGNOSTIC UPLOAD AIFLIX ===" -ForegroundColor Yellow
Write-Host "Base URL: $base"

# Test de connectivité de base
Write-Host "`n1) Test de connectivité de base"
try {
    $ping = Invoke-WebRequest -Uri $base -Method GET -UseBasicParsing -TimeoutSec 10
    Write-Host "Connectivité OK - Status: $($ping.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "PROBLEME de connectivité: $($_.Exception.Message)" -ForegroundColor Red
    Exit 1
}

# Création utilisateur
Write-Host "`n2) Création d'un utilisateur test"
$un = "DEBUG_UPL_" + (Get-Random -Maximum 999999)
$regBody = @{ name = $un; username = $un; password = 'Pass123!' } | ConvertTo-Json
try {
    $reg = Invoke-RestMethod -Uri "$base/api/register" -Method POST -ContentType 'application/json' -Body $regBody -TimeoutSec 15
    Write-Host "Register OK" -ForegroundColor Green
} catch {
    Write-Host "Register FAILED: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $status = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $status" -ForegroundColor Red
    }
    Exit 1
}

# Login
Write-Host "`n3) Login utilisateur test"
$loginBody = @{ username = $un; password = 'Pass123!' } | ConvertTo-Json
try {
    $login = Invoke-RestMethod -Uri "$base/api/login" -Method POST -ContentType 'application/json' -Body $loginBody -TimeoutSec 15
    $token = $login.token
    if ($token) {
        Write-Host "Login OK - Token reçu" -ForegroundColor Green
    } else {
        Write-Host "Login OK mais pas de token!" -ForegroundColor Yellow
        Exit 1
    }
} catch {
    Write-Host "Login FAILED: $($_.Exception.Message)" -ForegroundColor Red
    Exit 1
}

# Test upload JSON (petit fichier)
Write-Host "`n4) Test upload JSON (méthode recommandée)"
$testContent = "Test AIFLIX - " + (Get-Date).ToString()
$testBytes = [System.Text.Encoding]::UTF8.GetBytes($testContent)
$testBase64 = [Convert]::ToBase64String($testBytes)

$uploadBody = @{
    title = "Test Debug Upload"
    description = "Test automatique de debugging"
    type = "video"
    fileName = "debug-test.txt"
    fileType = "text/plain"
    fileBase64 = $testBase64
} | ConvertTo-Json

try {
    $headers = @{
        'Authorization' = "Bearer $token"
        'Content-Type' = 'application/json'
        'X-Debug' = 'true'
    }
    
    Write-Host "Envoi de la requête upload..." -ForegroundColor Yellow
    $resp = Invoke-WebRequest -Uri "$base/api/upload" -Method POST -Headers $headers -Body $uploadBody -UseBasicParsing -TimeoutSec 30
    
    Write-Host "UPLOAD REUSSI!" -ForegroundColor Green
    Write-Host "Status: $($resp.StatusCode)"
    Write-Host "Response: $($resp.Content)"
    
} catch {
    Write-Host "UPLOAD ECHEC!" -ForegroundColor Red
    Write-Host "Erreur: $($_.Exception.Message)"
    
    if ($_.Exception.Response) {
        $status = $_.Exception.Response.StatusCode.value__
        Write-Host "Status Code: $status" -ForegroundColor Red
        
        try {
            $stream = $_.Exception.Response.GetResponseStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $errorText = $reader.ReadToEnd()
            Write-Host "Détails de l'erreur:" -ForegroundColor Red
            Write-Host $errorText -ForegroundColor Red
        } catch {
            Write-Host "Impossible de lire les détails de l'erreur" -ForegroundColor Red
        }
    }
}

Write-Host "`n=== FIN DU DIAGNOSTIC ===" -ForegroundColor Yellow