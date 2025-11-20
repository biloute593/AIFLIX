# 📊 Guide de Configuration du Monitoring AIFLIX

## Vue d'Ensemble

Ce guide décrit la configuration du monitoring gratuit pour l'infrastructure AIFLIX Azure.

---

## 1. Application Insights (5GB/mois gratuit)

### Configuration via Azure Portal

1. **Créer la ressource**
   ```
   Portal: https://portal.azure.com
   → Créer une ressource
   → Monitoring + Management
   → Application Insights
   ```

2. **Paramètres**
   - **Nom:** `aiflix-insights`
   - **Region:** `East US` (même région que Storage/Cosmos DB)
   - **Resource Group:** `aiflix-rg`
   - **Mode:** Classic (gratuit - 5GB/mois)

3. **Récupérer Instrumentation Key**
   ```
   Application Insights → Properties → Instrumentation Key
   ```

4. **Ajouter à Vercel**
   ```powershell
   vercel env add APPINSIGHTS_INSTRUMENTATIONKEY production
   # Coller la clé quand demandé
   ```

5. **Installer package dans Next.js**
   ```bash
   npm install applicationinsights
   ```

6. **Configuration dans `src/lib/appinsights.ts`**
   ```typescript
   import * as appInsights from 'applicationinsights';
   
   if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
     appInsights.setup(process.env.APPINSIGHTS_INSTRUMENTATIONKEY)
       .setAutoDependencyCorrelation(true)
       .setAutoCollectRequests(true)
       .setAutoCollectPerformance(true)
       .setAutoCollectExceptions(true)
       .start();
   }
   
   export const client = appInsights.defaultClient;
   ```

---

## 2. Alertes Azure (Gratuites)

### Alerte Storage Capacity (>4GB)

```bash
az monitor metrics alert create \
  --name "aiflix-storage-capacity-alert" \
  --resource-group aiflix-rg \
  --scopes "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.Storage/storageAccounts/stywuuywn7ytpkw" \
  --condition "total UsedCapacity > 4294967296" \
  --description "Storage used > 4GB (80% of 5GB free tier)" \
  --severity 2 \
  --window-size 1h \
  --evaluation-frequency 1h
```

### Alerte Cosmos DB RU/s (>350)

```bash
az monitor metrics alert create \
  --name "aiflix-cosmosdb-ru-alert" \
  --resource-group aiflix-rg \
  --scopes "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-aiflix-eastus" \
  --condition "total TotalRequestUnits > 350" \
  --description "Cosmos DB approaching 400 RU/s limit (87.5%)" \
  --severity 2 \
  --window-size 5m \
  --evaluation-frequency 5m
```

### Alerte HTTP 5xx Errors (>10/hour)

```bash
# Nécessite Application Insights configuré
az monitor metrics alert create \
  --name "aiflix-http-errors-alert" \
  --resource-group aiflix-rg \
  --scopes "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/microsoft.insights/components/aiflix-insights" \
  --condition "count requests/failed > 10" \
  --description "HTTP 5xx errors > 10 in last hour" \
  --severity 1 \
  --window-size 1h \
  --evaluation-frequency 5m
```

---

## 3. Diagnostic Logs (Gratuit - 7 jours retention)

### Storage Account Logging

```bash
az storage logging update \
  --account-name stywuuywn7ytpkw \
  --log rwd \
  --retention 7 \
  --services b \
  --account-key [AZURE_STORAGE_ACCOUNT_KEY]
```

### Cosmos DB Diagnostic Settings

```bash
az monitor diagnostic-settings create \
  --name "cosmosdb-diagnostics" \
  --resource "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-aiflix-eastus" \
  --logs '[{"category":"DataPlaneRequests","enabled":true,"retentionPolicy":{"enabled":true,"days":7}}]' \
  --metrics '[{"category":"Requests","enabled":true,"retentionPolicy":{"enabled":true,"days":7}}]'
```

---

## 4. Monitoring Vercel (Intégré Gratuit)

### Analytics Dashboard
```
URL: https://vercel.com/biloutes-593/aiflix/analytics
```

**Métriques disponibles:**
- ✓ Page views
- ✓ Unique visitors
- ✓ Top pages
- ✓ Geographic distribution
- ✓ Device types

### Performance Monitoring
```
URL: https://vercel.com/biloutes-593/aiflix/performance
```

**Métriques disponibles:**
- ✓ Core Web Vitals (LCP, FID, CLS)
- ✓ Time to First Byte (TTFB)
- ✓ Edge cache hit rate
- ✓ Function execution time

### Logs
```
URL: https://vercel.com/biloutes-593/aiflix/logs
```

**Filtres disponibles:**
- Par environnement (production/preview/development)
- Par status code
- Par région Edge
- Par timeframe

---

## 5. Configuration Notifications

### Action Group (Email/SMS)

```bash
az monitor action-group create \
  --name "aiflix-alerts" \
  --resource-group aiflix-rg \
  --short-name "aiflix" \
  --email-receiver name="admin" email="[VOTRE_EMAIL]"
```

### Lier aux Alertes

```bash
# Mettre à jour les alertes pour utiliser action group
az monitor metrics alert update \
  --name "aiflix-storage-capacity-alert" \
  --resource-group aiflix-rg \
  --add-action "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/microsoft.insights/actionGroups/aiflix-alerts"
```

---

## 6. Métriques Clés à Surveiller

### Storage Account
- **UsedCapacity**: Alerte à 4GB (80% du quota gratuit 5GB)
- **Transactions**: Surveiller augmentation anormale
- **Availability**: Maintenir >99.9%
- **SuccessE2ELatency**: Maintenir <100ms p95

### Cosmos DB
- **TotalRequestUnits**: Alerte à 350 RU/s (87.5% du quota 400)
- **AvailableStorage**: Surveiller croissance
- **ServerSideLatency**: Maintenir <50ms p95
- **ServiceAvailability**: Maintenir >99.99%

### Application (via App Insights)
- **HTTP 5xx**: Alerte >10/hour
- **Response Time**: p95 <500ms
- **Failed Requests**: <1%
- **Exceptions**: Tracker et investiguer

### Vercel Edge
- **Cache Hit Rate**: Optimiser pour >80%
- **Edge Response Time**: <50ms p95
- **Function Duration**: <1s p95
- **Bandwidth**: Surveiller pour rester <100GB/mois gratuit

---

## 7. Dashboard Recommandés

### Azure Portal Dashboard

Créer dashboard custom avec:
1. Storage Capacity chart (7 jours)
2. Cosmos DB RU/s consumption (24h)
3. Alert summary
4. Resource health status

### Grafana Cloud (Gratuit)

Configuration optionnelle:
```
1. Créer compte: https://grafana.com
2. Ajouter Azure data source
3. Import dashboard templates
4. Configure alerting webhooks
```

---

## 8. Maintenance Régulière

### Quotidien
- ✓ Vérifier Vercel logs pour erreurs
- ✓ Monitorer Core Web Vitals
- ✓ Check cache hit rate

### Hebdomadaire
- ✓ Review Storage capacity trend
- ✓ Analyze Cosmos DB RU/s patterns
- ✓ Check alert history
- ✓ Review error logs

### Mensuel
- ✓ Analyze cost trends
- ✓ Review performance metrics
- ✓ Optimize queries based on insights
- ✓ Update alert thresholds if needed

### Trimestriel (90 jours)
- ✓ **Rotate security keys** (voir `scripts/rotate_keys.ps1`)
- ✓ Review backup policies
- ✓ Audit access logs
- ✓ Update monitoring configuration

---

## 9. Troubleshooting

### Storage Alerts
```bash
# Check current storage usage
az storage account show-usage \
  --account-name stywuuywn7ytpkw

# List largest blobs
az storage blob list \
  --account-name stywuuywn7ytpkw \
  --container-name videos \
  --query "sort_by([].{Name:name, Size:properties.contentLength}, &Size) | reverse(@)" \
  --output table
```

### Cosmos DB Performance
```bash
# Check current RU/s consumption
az cosmosdb mongodb collection throughput show \
  --account-name cosmos-aiflix-eastus \
  --database-name aiflix \
  --name users \
  --resource-group aiflix-rg
```

### Application Insights Queries (KQL)

**Top 10 Slowest Requests:**
```kql
requests
| where timestamp > ago(1h)
| order by duration desc
| take 10
| project timestamp, name, duration, resultCode
```

**Error Rate by Hour:**
```kql
requests
| where timestamp > ago(24h)
| summarize ErrorCount = countif(success == false), TotalCount = count() by bin(timestamp, 1h)
| project timestamp, ErrorRate = (ErrorCount * 100.0) / TotalCount
```

---

## 10. Coûts Estimés

### Totalement Gratuit
- ✓ Application Insights: 5GB/mois
- ✓ Alertes Metrics: Illimitées
- ✓ Vercel Analytics: Inclus
- ✓ Azure Monitor basic metrics: Inclus

### Potentiellement Payant (à surveiller)
- ⚠️ Application Insights >5GB/mois: $2.30/GB
- ⚠️ Log Analytics: Premier 5GB gratuit, puis $2.30/GB
- ⚠️ SMS notifications: ~$0.015/SMS

**Recommandation:** Utiliser uniquement email notifications (gratuit)

---

## 11. Quick Commands

```powershell
# Check all alerts status
az monitor metrics alert list \
  --resource-group aiflix-rg \
  --query "[].{Name:name, Enabled:enabled, Severity:severity}" \
  --output table

# View recent alert activations
az monitor activity-log list \
  --resource-group aiflix-rg \
  --caller "Microsoft.Insights" \
  --max-events 20 \
  --output table

# Get Storage metrics (last 24h)
az monitor metrics list \
  --resource "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.Storage/storageAccounts/stywuuywn7ytpkw" \
  --metric UsedCapacity \
  --start-time (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ssZ") \
  --interval PT1H

# Get Cosmos DB metrics (last 24h)
az monitor metrics list \
  --resource "/subscriptions/e94faaa8-6fe1-48e9-a3b3-bbe831d48db1/resourceGroups/aiflix-rg/providers/Microsoft.DocumentDB/databaseAccounts/cosmos-aiflix-eastus" \
  --metric TotalRequestUnits \
  --start-time (Get-Date).AddDays(-1).ToString("yyyy-MM-ddTHH:mm:ssZ") \
  --interval PT5M
```

---

## ✅ Setup Checklist

- [ ] Application Insights créé
- [ ] Instrumentation Key ajoutée à Vercel
- [ ] Package applicationinsights installé
- [ ] Storage capacity alert configurée
- [ ] Cosmos DB RU/s alert configurée
- [ ] Action Group email créé
- [ ] Diagnostic logs activés
- [ ] Dashboard Azure Portal créé
- [ ] Vercel Analytics vérifié
- [ ] Documentation équipe mise à jour

---

**Date de création:** 2025-11-20  
**Prochaine révision:** 2026-02-20 (avec rotation des clés)
