# AIFLIX — Guide développeur (rapide)

Ceci est un guide court pour configurer l'environnement local et Vercel pour le projet AIFLIX.

## Prérequis
- Node.js 16+ (ou version compatible indiquée dans package.json)
- Azure CLI (pour récupérer les clés et créer conteneurs)
- Vercel CLI (pour gérer les variables d'environnement et les déploiements)

## Variables d'environnement nécessaires
Les variables sensibles doivent être ajoutées via la CLI Vercel ou l'interface Vercel. Ne les commitez jamais.

- `AZURE_STORAGE_CONNECTION_STRING` — connection string du Storage account
- `AZURE_STORAGE_ACCOUNT_NAME` — nom du Storage account
- `AZURE_STORAGE_ACCOUNT_KEY` — clé d'accès du Storage account (ou use `AZURE_STORAGE_CONNECTION_STRING`)
- `AZURE_STORAGE_CONTAINER` — nom du conteneur blob (ex: `videos`)
- `AZURE_COSMOS_MONGODB_KEY` — clé MongoDB (Cosmos DB Mongo API)
- `JWT_SECRET` — secret JWT pour l'auth

### Ajouter une variable dans Vercel (exemple)
1. Récupérez la valeur via Azure CLI (exemple pour la connection string) :

```powershell
& "C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd" storage account show-connection-string --resource-group aiflix-rg --name <ACCOUNT_NAME> --query connectionString --output tsv
```

2. Ajoutez la variable sur Vercel (exemple via fichier temporaire pour éviter l'interactivité) :

```powershell
Set-Content -Path .\\tmp_val.txt -Value "<LA_VALEUR_RECUPEREE>"
cmd /c "vercel env add AZURE_STORAGE_CONNECTION_STRING development < .\\tmp_val.txt"
cmd /c "vercel env add AZURE_STORAGE_CONNECTION_STRING preview < .\\tmp_val.txt"
cmd /c "vercel env add AZURE_STORAGE_CONNECTION_STRING production < .\\tmp_val.txt"
Remove-Item .\\tmp_val.txt
```

## Scripts utiles (dans `scripts/`)
- `debug_upload.ps1` — crée un utilisateur test, se loggue et tente un upload (avec `X-Debug` activé)
- `test_upload.ps1` — test d'upload simple
- `test_web_upload.ps1` — vérifie que les pages publiques sont accessibles

## Déploiement
Déployer en production :

```powershell
vercel --prod
```

## Bonnes pratiques
- Ne commitez jamais de clés/connection strings. Utilisez `vercel env`.
- Désactivez `DEBUG_UPLOAD` en production une fois le debug terminé.

Si vous voulez, je peux automatiser l'ajout des variables restantes côté Vercel (je n'écrirai jamais de secrets dans le dépôt).
