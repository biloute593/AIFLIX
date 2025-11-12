# Script de resolution complete des problemes AIFLIX
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\fix_simple.ps1

Write-Host "=== RESOLUTION AIFLIX ===" -ForegroundColor Yellow

Write-Host "`nPROBLEME 1: Erreur CSS -webkit-text-size-adjust"
Write-Host "RESOLU: Prefixes vendor ajoutes dans globals.css" -ForegroundColor Green

Write-Host "`nPROBLEME 2: Configuration Azure Storage"
Write-Host "Compte de stockage recommande: stywuuywn7ytpkw (East US)"

Write-Host "`nTEST DE L'APPLICATION..."
$testUrl = "https://aiflix-e64r9c7i9-biloutes-593.vercel.app"

try {
    $response = Invoke-WebRequest -Uri $testUrl -UseBasicParsing -TimeoutSec 10
    Write-Host "Application accessible - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Application inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nACTIONS MANUELLES REQUISES:"
Write-Host "1. Recuperer la cle d'acces Azure:"
Write-Host "   - Aller sur portal.azure.com"
Write-Host "   - Storage Account > stywuuywn7ytpkw"
Write-Host "   - Security + networking > Access keys"
Write-Host "   - Copier key1"

Write-Host "2. Configurer la cle avec Vercel:"
Write-Host "   vercel env add AZURE_STORAGE_KEY_NEW"
Write-Host "   (Coller la cle copiee)"

Write-Host "3. Creer le conteneur 'videos' dans Azure Portal"

Write-Host "4. Tester l'upload avec notre script de debug"

Write-Host "`nRESUME:" -ForegroundColor Cyan
Write-Host "CSS corrige - erreur -webkit-text-size-adjust resolue"
Write-Host "Azure Storage identifie - actions manuelles requises"

Write-Host "`n=== FIN ===" -ForegroundColor Yellow