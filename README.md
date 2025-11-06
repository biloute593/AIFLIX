# AIFlix

Plateforme web pour partager et découvrir des séries et films générés par IA.

## Fonctionnalités

- Inscription et connexion des utilisateurs
- Upload de contenu vidéo (films et séries)
- Navigation et découverte de contenu
- Interface moderne inspirée de Netflix

## Technologies utilisées

- Next.js 14 avec TypeScript
- Tailwind CSS pour le styling
- Azure Cosmos DB (MongoDB API)
- Azure Blob Storage
- Azure Web App Service

## Installation locale

1. Cloner le repository
2. Installer les dépendances : `npm install`
3. Configurer les variables d'environnement Azure dans `.env.local`
4. Lancer le serveur de développement : `npm run dev`

## Déploiement sur Azure

1. Installer Azure CLI et AZD
2. Se connecter : `az login`
3. Initialiser AZD : `azd init`
4. Déployer : `azd up`

L'application sera déployée sur Azure Web App avec Cosmos DB et Blob Storage.

## Structure du projet

```
src/
  app/          # Pages Next.js (App Router)
  components/   # Composants React réutilisables
  lib/          # Utilitaires et configurations
prisma/         # Schéma de base de données
public/         # Assets statiques
```

## Démarrage

```bash
npm run dev
```

L'application sera disponible sur http://localhost:3000