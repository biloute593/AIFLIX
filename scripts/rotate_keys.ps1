# Script de rotation des clés Azure Storage et Cosmos DB
# À exécuter tous les 90 jours pour sécurité optimale

Write-Host "=== ROTATION DES CLES AZURE ===" -ForegroundColor Yellow
Write-Host "Date: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')`n"

$resourceGroup = "aiflix-rg"
$storageAccount = "stywuuywn7ytpkw"
$cosmosAccount = "cosmos-aiflix-eastus"

# 1. Rotation Azure Storage Key
Write-Host "1) Rotation Storage Account Key..." -ForegroundColor Cyan
Write-Host "   Account: $storageAccount"

# Régénérer key2 en premier (pour éviter downtime)
Write-Host "   Régénération de key2..."
& "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" storage account keys renew `
    --account-name $storageAccount `
    --resource-group $resourceGroup `
    --key secondary

# Récupérer la nouvelle key2
$keys = & "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" storage account keys list `
    --account-name $storageAccount `
    --resource-group $resourceGroup `
    --query "[?keyName=='key2'].value" -o tsv

if ($keys) {
    Write-Host "   Nouvelle key2 générée" -ForegroundColor Green
    Write-Host "   Mise à jour Vercel avec key2..."
    
    Set-Content -Path "temp_storage_key.txt" -Value $keys -NoNewline
    cmd /c "vercel env add AZURE_STORAGE_ACCOUNT_KEY_FINAL production < temp_storage_key.txt" 2>&1 | Out-Null
    cmd /c "vercel env add AZURE_STORAGE_ACCOUNT_KEY_FINAL preview < temp_storage_key.txt" 2>&1 | Out-Null
    cmd /c "vercel env add AZURE_STORAGE_ACCOUNT_KEY_FINAL development < temp_storage_key.txt" 2>&1 | Out-Null
    Remove-Item "temp_storage_key.txt"
    
    Write-Host "   Vercel mis à jour avec key2" -ForegroundColor Green
    Write-Host "   Redéploiement nécessaire: vercel --prod" -ForegroundColor Yellow
    
    # Attendre confirmation déploiement
    Write-Host "`n   Appuyez sur ENTREE après avoir vérifié que le déploiement fonctionne..."
    Read-Host
    
    # Régénérer key1 (l'ancienne clé)
    Write-Host "   Régénération de key1 (ancienne clé)..."
    & "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" storage account keys renew `
        --account-name $storageAccount `
        --resource-group $resourceGroup `
        --key primary
    
    Write-Host "   Storage keys rotation complétée!" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: Impossible de récupérer la nouvelle clé" -ForegroundColor Red
}

# 2. Rotation Cosmos DB Key
Write-Host "`n2) Rotation Cosmos DB Key..." -ForegroundColor Cyan
Write-Host "   Account: $cosmosAccount"

# Régénérer secondary key en premier
Write-Host "   Régénération de secondaryMasterKey..."
& "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" cosmosdb keys regenerate `
    --name $cosmosAccount `
    --resource-group $resourceGroup `
    --key-kind secondary

# Récupérer la nouvelle secondary key
$cosmosKeys = & "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" cosmosdb keys list `
    --name $cosmosAccount `
    --resource-group $resourceGroup `
    --type keys `
    --query "secondaryMasterKey" -o tsv

if ($cosmosKeys) {
    Write-Host "   Nouvelle secondaryMasterKey générée" -ForegroundColor Green
    Write-Host "   Mise à jour Vercel avec secondary key..."
    
    Set-Content -Path "temp_cosmos_key.txt" -Value $cosmosKeys -NoNewline
    cmd /c "vercel env rm AZURE_COSMOS_MONGODB_KEY_FINAL production --yes" 2>&1 | Out-Null
    cmd /c "vercel env rm AZURE_COSMOS_MONGODB_KEY_FINAL preview --yes" 2>&1 | Out-Null
    cmd /c "vercel env rm AZURE_COSMOS_MONGODB_KEY_FINAL development --yes" 2>&1 | Out-Null
    
    cmd /c "vercel env add AZURE_COSMOS_MONGODB_KEY_FINAL production < temp_cosmos_key.txt" 2>&1 | Out-Null
    cmd /c "vercel env add AZURE_COSMOS_MONGODB_KEY_FINAL preview < temp_cosmos_key.txt" 2>&1 | Out-Null
    cmd /c "vercel env add AZURE_COSMOS_MONGODB_KEY_FINAL development < temp_cosmos_key.txt" 2>&1 | Out-Null
    Remove-Item "temp_cosmos_key.txt"
    
    Write-Host "   Vercel mis à jour avec secondary key" -ForegroundColor Green
    Write-Host "   Redéploiement nécessaire: vercel --prod" -ForegroundColor Yellow
    
    # Attendre confirmation déploiement
    Write-Host "`n   Appuyez sur ENTREE après avoir vérifié que le déploiement fonctionne..."
    Read-Host
    
    # Régénérer primary key (l'ancienne clé)
    Write-Host "   Régénération de primaryMasterKey (ancienne clé)..."
    & "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" cosmosdb keys regenerate `
        --name $cosmosAccount `
        --resource-group $resourceGroup `
        --key-kind primary
    
    Write-Host "   Cosmos DB keys rotation complétée!" -ForegroundColor Green
} else {
    Write-Host "   ERREUR: Impossible de récupérer la nouvelle clé" -ForegroundColor Red
}

Write-Host "`n=== ROTATION TERMINÉE ===" -ForegroundColor Green
Write-Host "Prochaine rotation recommandée: $(Get-Date (Get-Date).AddDays(90) -Format 'yyyy-MM-dd')"
Write-Host "`nN'oubliez pas de:"
Write-Host "1. Tester l'application après rotation"
Write-Host "2. Documenter la date de rotation"
Write-Host "3. Configurer un rappel pour dans 90 jours"
