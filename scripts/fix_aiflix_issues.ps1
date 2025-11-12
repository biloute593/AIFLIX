# Script de résolution complète des problèmes AIFLIX
# Usage: powershell -ExecutionPolicy Bypass -File .\scripts\fix_aiflix_issues.ps1

Write-Host "=== RESOLUTION COMPLETE DES PROBLEMES AIFLIX ===" -ForegroundColor Yellow

Write-Host "`n🔧 PROBLEME 1: Erreur CSS -webkit-text-size-adjust"
Write-Host "✅ RESOLU: Préfixes vendor ajoutés dans globals.css" -ForegroundColor Green

Write-Host "`n🔧 PROBLEME 2: Configuration Azure Storage"
Write-Host "Compte de stockage recommandé: stywuuywn7ytpkw (East US)"

Write-Host "`n📋 VARIABLES D'ENVIRONNEMENT ACTUELLES:"
Write-Host "Les variables suivantes existent avec des doublons/conflits:"
Write-Host "- AZURE_STORAGE_ACCOUNT_NAME (plusieurs versions)"
Write-Host "- AZURE_STORAGE_ACCOUNT_KEY vs AZURE_STORAGE_ACCESS_KEY"
Write-Host "- AZURE_STORAGE_CONTAINER vs AZURE_STORAGE_CONTAINER_NAME"

Write-Host "`n🎯 SOLUTION RECOMMANDEE:"
Write-Host "1. Utiliser le compte existant: stywuuywn7ytpkw"
Write-Host "2. Nom du conteneur: videos"  
Write-Host "3. Harmoniser les variables d'environnement"

Write-Host "`n🚀 DEPLOIEMENT DES CORRECTIONS CSS..."
try {
    $deploy = Start-Process "vercel" -ArgumentList "--prod" -WorkingDirectory (Get-Location) -Wait -PassThru
    if ($deploy.ExitCode -eq 0) {
        Write-Host "✅ Déploiement CSS réussi!" -ForegroundColor Green
    } else {
        Write-Host "❌ Problème de déploiement" -ForegroundColor Red
    }
} catch {
    Write-Host "⚠️  Déploiement manuel requis: vercel --prod" -ForegroundColor Yellow
}

Write-Host "`n🧪 TEST DE L'APPLICATION..."
$testUrl = "https://aiflix-k1kiqrogi-biloutes-593.vercel.app"

try {
    $response = Invoke-WebRequest -Uri $testUrl -UseBasicParsing -TimeoutSec 10
    Write-Host "✅ Application accessible - Status: $($response.StatusCode)" -ForegroundColor Green
} catch {
    Write-Host "❌ Application inaccessible: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n📋 ACTIONS MANUELLES REQUISES:"
Write-Host "1. 🔐 Récupérer la clé d'accès Azure:"
Write-Host "   - Aller sur portal.azure.com"
Write-Host "   - Storage Account > stywuuywn7ytpkw"
Write-Host "   - Security + networking > Access keys"
Write-Host "   - Copier key1"

Write-Host "2. 🔧 Configurer la clé:"
Write-Host "   vercel env add AZURE_STORAGE_KEY [LA_CLE_COPIEE] production"

Write-Host "3. 📁 Créer le conteneur 'videos':"
Write-Host "   - Dans Azure Portal: Storage Account > Containers"
Write-Host "   - Nouveau conteneur nommé 'videos'"
Write-Host "   - Accès privé (pas d'accès public)"

Write-Host "4. ✅ Tester l'upload:"
Write-Host "   .\scripts\debug_upload.ps1"

Write-Host "`n💡 ASTUCE: Une fois configuré, désactiver DEBUG_UPLOAD:"
Write-Host "   vercel env rm DEBUG_UPLOAD"

Write-Host "`n=== RESUME ===" -ForegroundColor Cyan
Write-Host "✅ CSS corrigé (erreur -webkit-text-size-adjust)"
Write-Host "🔧 Azure Storage identifié (stywuuywn7ytpkw)"
Write-Host "📋 Actions manuelles requises pour finaliser"

Write-Host "`n=== FIN RESOLUTION ===" -ForegroundColor Yellow