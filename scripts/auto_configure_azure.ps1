# Script d'automatisation complete pour configuration Azure Storage + Vercel
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\auto_configure_azure.ps1

Write-Host "=== CONFIGURATION AUTOMATIQUE AZURE STORAGE + VERCEL ===" -ForegroundColor Yellow

# Variables
$azCmd = "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd"
$resourceGroup = "aiflix-rg"
$storageAccount = "stywuuywn7ytpkw"
$containerName = "videos"

Write-Host "`n1) Recuperation des informations Azure Storage..." -ForegroundColor Green

# Recuperer la cle d'acces
Write-Host "Recuperation de la cle d'acces..."
$storageKey = & $azCmd storage account keys list --resource-group $resourceGroup --account-name $storageAccount --query "[0].value" --output tsv
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Cle d'acces recuperee" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la recuperation de la cle" -ForegroundColor Red
    exit 1
}

# Recuperer la connection string
Write-Host "Recuperation de la connection string..."
$connectionString = & $azCmd storage account show-connection-string --resource-group $resourceGroup --name $storageAccount --query "connectionString" --output tsv
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Connection string recuperee" -ForegroundColor Green
} else {
    Write-Host "❌ Erreur lors de la recuperation de la connection string" -ForegroundColor Red
    exit 1
}

Write-Host "`n2) Configuration des variables d'environnement Vercel..." -ForegroundColor Green

# Fonction pour configurer une variable Vercel
function Set-VercelEnv {
    param($name, $value)
    
    Write-Host "Configuration de $name..."
    
    # Creer un fichier temporaire avec la valeur
    $tempFile = [System.IO.Path]::GetTempFileName()
    $value | Out-File -FilePath $tempFile -Encoding UTF8 -NoNewline
    
    # Utiliser vercel env avec le fichier temporaire
    try {
        # Pour chaque environnement
        $envs = @("production", "development", "preview")
        foreach ($env in $envs) {
            Write-Host "  - $env..."
            $result = cmd /c "echo $value | vercel env add $name $env"
            if ($LASTEXITCODE -eq 0) {
                Write-Host "    ✅ $env OK" -ForegroundColor Green
            } else {
                Write-Host "    ⚠️ $env peut deja exister" -ForegroundColor Yellow
            }
        }
    } finally {
        # Nettoyer le fichier temporaire
        Remove-Item -Path $tempFile -ErrorAction SilentlyContinue
    }
}

# Configuration des variables
Write-Host "`n📝 Configuration AZURE_STORAGE_CONNECTION_STRING_FINAL..."
Write-Host "Valeur: $connectionString"

Write-Host "`n📝 Configuration AZURE_STORAGE_ACCOUNT_NAME_FINAL..."
Write-Host "Valeur: $storageAccount"

Write-Host "`n📝 Configuration AZURE_STORAGE_ACCOUNT_KEY_FINAL..."
Write-Host "Valeur: $storageKey"

Write-Host "`n📝 Configuration AZURE_STORAGE_CONTAINER_FINAL..."
Write-Host "Valeur: $containerName"

Write-Host "`n3) Verification du conteneur..." -ForegroundColor Green
$containers = & $azCmd storage container list --account-name $storageAccount --account-key $storageKey --output table
Write-Host $containers

Write-Host "`n4) Affichage des valeurs pour configuration manuelle..." -ForegroundColor Cyan
Write-Host "AZURE_STORAGE_CONNECTION_STRING_FINAL:"
Write-Host $connectionString
Write-Host "`nAZURE_STORAGE_ACCOUNT_NAME_FINAL:"
Write-Host $storageAccount
Write-Host "`nAZURE_STORAGE_ACCOUNT_KEY_FINAL:"
Write-Host $storageKey
Write-Host "`nAZURE_STORAGE_CONTAINER_FINAL:"
Write-Host $containerName

Write-Host "`n=== CONFIGURATION TERMINEE ===" -ForegroundColor Yellow