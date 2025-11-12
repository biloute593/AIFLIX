# Test des variables d'environnement Vercel pour AIFLIX
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\test_env.ps1

Write-Host "=== TEST VARIABLES D'ENVIRONNEMENT AIFLIX ===" -ForegroundColor Yellow

Write-Host "`nVérification des variables d'environnement Vercel..."

# Test en development
Write-Host "`n1) Variables Development:"
try {
    vercel env ls --environment development | Select-String "AZURE"
} catch {
    Write-Host "Erreur lors de la récupération des variables dev: $($_.Exception.Message)"
}

# Test en production  
Write-Host "`n2) Variables Production:"
try {
    vercel env ls --environment production | Select-String "AZURE"
} catch {
    Write-Host "Erreur lors de la récupération des variables prod: $($_.Exception.Message)"
}

Write-Host "`n=== RECOMMANDATIONS ===" -ForegroundColor Green
Write-Host "Pour le DEBUG_UPLOAD, répondez simplement: true"
Write-Host "Pour corriger le storage, il faut s'assurer que ces variables existent:"
Write-Host "- AZURE_STORAGE_ACCOUNT_NAME"
Write-Host "- AZURE_STORAGE_ACCOUNT_KEY (ou AZURE_STORAGE_ACCESS_KEY)"
Write-Host "- AZURE_STORAGE_CONTAINER"

Write-Host "`n=== FIN TEST ===" -ForegroundColor Yellow