# Configuration Application Insights et Alertes
# Monitoring gratuit pour AIFLIX

Write-Host "=== CONFIGURATION MONITORING AIFLIX ===" -ForegroundColor Yellow

# Note: Application Insights nécessite l'enregistrement du provider Microsoft.OperationalInsights
# qui peut prendre du temps. Configuration manuelle recommandée via Azure Portal.

Write-Host "`n📊 MONITORING RECOMMENDATIONS" -ForegroundColor Cyan

Write-Host "`n1. Application Insights (Gratuit - 5GB/mois)"
Write-Host "   Portal: https://portal.azure.com"
Write-Host "   - Créer: Monitoring + Management > Application Insights"
Write-Host "   - Nom: aiflix-insights"
Write-Host "   - Region: East US"
Write-Host "   - Mode: Classic (gratuit)"
Write-Host "   - Récupérer Instrumentation Key"
Write-Host "   - Ajouter APPINSIGHTS_INSTRUMENTATIONKEY à Vercel"

Write-Host "`n2. Alertes Storage Account (Gratuites)"
Write-Host "   Commandes CLI:"
Write-Host '   # Alerte Storage > 4GB (80% du quota gratuit 5GB)'
Write-Host '   az monitor metrics alert create \'
Write-Host '     --name "storage-capacity-alert" \'
Write-Host '     --resource-group aiflix-rg \'
Write-Host '     --scopes "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.Storage/storageAccounts/stywuuywn7ytpkw" \'
Write-Host '     --condition "total UsedCapacity > 4294967296" \'
Write-Host '     --description "Storage used > 4GB (80% of free tier)"'

Write-Host "`n3. Alertes Cosmos DB (Gratuites)"
Write-Host '   # Alerte RU/s > 350 (87.5% du quota 400 RU/s)'
Write-Host '   az monitor metrics alert create \'
Write-Host '     --name "cosmosdb-ru-alert" \'
Write-Host '     --resource-group aiflix-rg \'
Write-Host '     --scopes "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-aiflix-eastus" \'
Write-Host '     --condition "total TotalRequestUnits > 350" \'
Write-Host '     --description "Cosmos DB approaching RU/s limit"'

Write-Host "`n4. Monitoring Vercel (Gratuit)"
Write-Host "   Dashboard: https://vercel.com/biloutes-593/aiflix/analytics"
Write-Host "   - Performance metrics"
Write-Host "   - Error tracking"
Write-Host "   - Edge caching stats"

Write-Host "`n5. Azure Monitor Logs (Basique Gratuit)"
Write-Host '   # Activer diagnostic logs pour Storage'
Write-Host '   az storage logging update \'
Write-Host '     --account-name stywuuywn7ytpkw \'
Write-Host '     --log rwd \'
Write-Host '     --retention 7 \'
Write-Host '     --services b \'
Write-Host '     --account-key [KEY]'

Write-Host "`n📈 MÉTRIQUES À SURVEILLER" -ForegroundColor Cyan
Write-Host "   ✓ Storage Capacity (alerte à 4GB)"
Write-Host "   ✓ Cosmos DB RU/s (alerte à 350)"
Write-Host "   ✓ HTTP 5xx errors (>10/hour)"
Write-Host "   ✓ Latency (p95 <500ms)"
Write-Host "   ✓ Blob upload failures"

Write-Host "`n🔔 CONFIGURATION RECOMMANDÉE" -ForegroundColor Cyan
Write-Host "   Email notifications: [Configurer dans Azure Portal]"
Write-Host "   SMS: [Optionnel - peut avoir coûts]"
Write-Host "   Webhook: [Slack/Teams/Discord]"

Write-Host "`n✅ MONITORING SETUP GUIDE CREATED" -ForegroundColor Green
Write-Host "   Fichier: MONITORING_SETUP_GUIDE.md"
