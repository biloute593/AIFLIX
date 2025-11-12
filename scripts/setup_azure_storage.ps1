# Configuration complète Azure Storage pour AIFLIX
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\setup_azure_storage.ps1

Write-Host "=== CONFIGURATION AZURE STORAGE AIFLIX ===" -ForegroundColor Yellow

# Variables de configuration
$storageAccountName = "stywuuywn7ytpkw"  # Account existant en East US
$containerName = "videos"
$resourceGroup = "aiflix-rg"

Write-Host "`n1) Configuration des variables d'environnement Vercel..."

# Supprimer l'ancienne variable si elle existe
Write-Host "Suppression de l'ancienne variable AZURE_STORAGE_ACCOUNT_NAME_NEW..."
try {
    vercel env rm AZURE_STORAGE_ACCOUNT_NAME_NEW --yes
} catch {
    Write-Host "Variable AZURE_STORAGE_ACCOUNT_NAME_NEW n'existe pas ou déjà supprimée"
}

Write-Host "`n2) Vérification du compte de stockage actuel..."
Write-Host "Compte de stockage: $storageAccountName"
Write-Host "Groupe de ressources: $resourceGroup"
Write-Host "Conteneur requis: $containerName"

Write-Host "`n3) Variables d'environnement à configurer:"
Write-Host "- AZURE_STORAGE_ACCOUNT_NAME = $storageAccountName"
Write-Host "- AZURE_STORAGE_CONTAINER = $containerName"
Write-Host "- La clé d'accès doit être récupérée depuis Azure Portal"

Write-Host "`n4) Instructions pour la configuration manuelle:"
Write-Host "1. Allez sur le portail Azure"
Write-Host "2. Naviguez vers Storage Account: $storageAccountName"
Write-Host "3. Allez dans Security + networking > Access keys"
Write-Host "4. Copiez la key1"
Write-Host "5. Exécutez: vercel env add AZURE_STORAGE_ACCOUNT_KEY [LA_CLE]"
Write-Host "6. Créez le conteneur 'videos' si nécessaire"

Write-Host "`n5) Test de la configuration actuelle..."
$currentUrl = "https://aiflix-k1kiqrogi-biloutes-593.vercel.app"

Write-Host "Test avec l'URL actuelle: $currentUrl"

# Test simple
try {
    $test = Invoke-WebRequest -Uri $currentUrl -UseBasicParsing -TimeoutSec 5
    Write-Host "Application accessible - Status: $($test.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "Problème d'accès à l'application: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== PROCHAINES ETAPES ===" -ForegroundColor Green
Write-Host "1. Récupérer la clé d'accès d'Azure Portal"
Write-Host "2. Configurer AZURE_STORAGE_ACCOUNT_KEY avec vercel env"
Write-Host "3. Créer le conteneur 'videos' via Azure Portal ou CLI"
Write-Host "4. Retester l'upload"

Write-Host "`n=== FIN CONFIGURATION ===" -ForegroundColor Yellow