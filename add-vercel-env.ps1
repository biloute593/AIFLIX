# Script PowerShell pour ajouter automatiquement les variables d'environnement Vercel
# REMPLACEZ LES VALEURS PLACEHOLDER PAR VOS VRAIES VALEURS AVANT D'EXECUTER

$envVars = @{
    "AZURE_COSMOS_ENDPOINT" = "https://your-cosmos-account.documents.azure.com:443/"
    "AZURE_COSMOS_KEY" = "your-cosmos-key-here"
    "AZURE_COSMOS_DATABASE" = "aiflix"
    "AZURE_COSMOS_CONNECTION_STRING" = "https://your-cosmos-account.documents.azure.com:443/"
    "AZURE_STORAGE_ACCOUNT_NAME" = "your-storage-account-name"
    "AZURE_STORAGE_ACCOUNT_KEY" = "your-storage-account-key-here"
    "AZURE_STORAGE_CONNECTION_STRING" = "DefaultEndpointsProtocol=https;AccountName=your-storage-account-name;AccountKey=your-storage-account-key-here;EndpointSuffix=core.windows.net"
    "AZURE_STORAGE_CONTAINER" = "videos"
    "JWT_SECRET" = "your-super-secure-jwt-secret-here-change-this-in-production"
}

Write-Host "Ajout des variables d'environnement Vercel pour le projet AIFLIX..."
Write-Host "Veuillez sélectionner les environnements (Production, Preview, Development) pour chaque variable"
Write-Host ""

foreach ($key in $envVars.Keys) {
    Write-Host "Ajout de $key = $($envVars[$key])"
    # Utiliser echo pour fournir automatiquement la valeur et les environnements
    echo "y`nProduction`nPreview`nDevelopment`n" | vercel env add $key
    Start-Sleep -Seconds 2
}

Write-Host "Toutes les variables d'environnement ont été ajoutées à Vercel !"