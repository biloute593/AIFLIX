# AIFLIX - Netflix-like App for AI-Generated Content

Une application web complète similaire à Netflix pour le contenu généré par IA, avec authentification utilisateur, upload de vidéos, et lecture en streaming.

## 🚀 Architecture Déploiement Hybride

Cette application utilise une architecture hybride :
- **Backend Azure** : Cosmos DB (MongoDB API) + Azure Blob Storage
- **Frontend Vercel** : Déploiement Next.js optimisé

## 📋 Prérequis

### Azure Resources (Backend)
- Azure Cosmos DB account (MongoDB API)
- Azure Blob Storage account
- Azure CLI installé et configuré

### Frontend Deployment
- Vercel CLI installé
- Compte Vercel
- Git repository

## 🛠️ Configuration Azure (Backend)

### 1. Créer les ressources Azure

```bash
# Se connecter à Azure
az login

# Créer un groupe de ressources
az group create --name aiflix-rg --location eastus

# Créer Cosmos DB (MongoDB API)
az cosmosdb create \
  --name aiflix-cosmos \
  --resource-group aiflix-rg \
  --kind MongoDB \
  --server-version 4.0 \
  --default-consistency-level Session \
  --enable-automatic-failover true

# Créer Blob Storage
az storage account create \
  --name aiflixstorage \
  --resource-group aiflix-rg \
  --location eastus \
  --sku Standard_LRS \
  --kind StorageV2

# Créer un container pour les vidéos
az storage container create \
  --name videos \
  --account-name aiflixstorage \
  --public-access blob
```

### 2. Récupérer les clés de connexion

```bash
# Clés Cosmos DB
az cosmosdb keys list \
  --name aiflix-cosmos \
  --resource-group aiflix-rg \
  --type connection-strings

# Clés Blob Storage
az storage account keys list \
  --account-name aiflixstorage \
  --resource-group aiflix-rg
```

## 🚀 Déploiement Frontend sur Vercel

### 1. Préparer le projet

```bash
# Installer Vercel CLI (déjà fait)
npm install -g vercel

# Initialiser Git (déjà fait)
git init
git add .
git commit -m "Initial commit: Complete Netflix-like app with Azure backend and Vercel frontend deployment"
```

### 2. Configurer Vercel

```bash
# Se connecter à Vercel
vercel login

# Déployer (choisir les options interactives)
vercel

# Ou déployer directement
vercel --prod
```

### 3. Configurer les variables d'environnement dans Vercel

Dans le dashboard Vercel, allez dans Settings > Environment Variables et ajoutez :

```env
# Azure Cosmos DB
AZURE_COSMOS_CONNECTION_STRING=mongodb://aiflix-cosmos:your-password@your-endpoint:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT_NAME=aiflixstorage
AZURE_STORAGE_ACCESS_KEY=your-storage-access-key
AZURE_STORAGE_CONTAINER_NAME=videos

# JWT Secret (générez-en un sécurisé)
JWT_SECRET=your-super-secure-jwt-secret-here
```

## 🔧 Configuration Locale

### Variables d'environnement (.env.local)

Créez un fichier `.env.local` à la racine du projet :

```env
# Azure Cosmos DB
AZURE_COSMOS_CONNECTION_STRING=mongodb://aiflix-cosmos:your-password@your-endpoint:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000

# Azure Blob Storage
AZURE_STORAGE_ACCOUNT_NAME=aiflixstorage
AZURE_STORAGE_ACCESS_KEY=your-storage-access-key
AZURE_STORAGE_CONTAINER_NAME=videos

# JWT Secret
JWT_SECRET=your-super-secure-jwt-secret-here
```

### Installation et démarrage local

```bash
# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm run dev
```

L'application sera disponible sur `http://localhost:3000`

## 📁 Structure du Projet

```
aiflix/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API Routes
│   │   │   ├── register/      # Inscription utilisateur
│   │   │   ├── login/         # Connexion utilisateur
│   │   │   ├── upload/        # Upload de vidéos
│   │   │   └── contents/      # Récupération contenu
│   │   ├── browse/           # Page navigation contenu
│   │   ├── login/            # Page connexion
│   │   ├── register/         # Page inscription
│   │   ├── upload/           # Page upload
│   │   ├── watch/[id]/       # Page lecture vidéo
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Page d'accueil
│   ├── components/           # Composants React
│   │   ├── ContentCard.tsx   # Carte de contenu
│   │   └── Providers.tsx     # Providers context
│   ├── contexts/             # Context React
│   │   └── AuthContext.tsx   # Context authentification
│   └── lib/                  # Utilitaires
│       ├── azure.ts          # Configuration Azure
│       └── firebase.ts       # Configuration Firebase (legacy)
├── infra/                    # Infrastructure as Code
│   ├── main.bicep           # Template Azure Bicep
│   ├── main.json            # Template ARM
│   └── main.parameters.json # Paramètres déploiement
├── public/                   # Assets statiques
└── vercel-config.md         # Configuration Vercel
```

## 🎯 Fonctionnalités

### ✅ Implémentées
- **Authentification** : Inscription/connexion utilisateurs
- **Upload de vidéos** : Upload vers Azure Blob Storage
- **Navigation contenu** : Interface Netflix-like
- **Lecture vidéo** : Streaming avec React Player
- **Base de données** : Stockage métadonnées dans Cosmos DB
- **Interface responsive** : Design moderne avec Tailwind CSS

### 🔄 Architecture Hybride
- **Backend Azure** : Services cloud scalables et sécurisés
- **Frontend Vercel** : Déploiement optimisé et CDN global

## 🚀 Utilisation

### 1. Inscription
- Accédez à `/register`
- Créez un compte avec email et mot de passe

### 2. Connexion
- Accédez à `/login`
- Connectez-vous avec vos identifiants

### 3. Upload de contenu
- Accédez à `/upload`
- Sélectionnez une vidéo et ajoutez les métadonnées
- Publiez votre contenu

### 4. Navigation
- Page d'accueil : Contenu en vedette
- `/browse` : Tous les contenus disponibles
- Cliquez sur une carte pour regarder

## 🔒 Sécurité

- **Authentification JWT** : Tokens sécurisés pour les sessions
- **Azure AD** : Intégration possible avec Azure Active Directory
- **CORS** : Configuration appropriée pour le déploiement
- **Variables d'environnement** : Clés sensibles non commitées

## 📊 Performance

- **CDN Vercel** : Distribution globale optimisée
- **Azure Blob Storage** : Streaming vidéo efficace
- **Cosmos DB** : Requêtes rapides et scalables
- **Next.js** : Optimisations automatiques (SSR, ISR)

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** : Framework React avec App Router
- **TypeScript** : Typage statique
- **Tailwind CSS** : Framework CSS utilitaire
- **React Player** : Lecteur vidéo

### Backend
- **Azure Cosmos DB** : Base de données NoSQL (MongoDB API)
- **Azure Blob Storage** : Stockage fichiers
- **Next.js API Routes** : API REST

### DevOps
- **Vercel** : Déploiement frontend
- **Azure CLI** : Gestion infrastructure
- **Git** : Contrôle de version

## 📝 Scripts Disponibles

```bash
npm run dev          # Démarrage développement
npm run build        # Build production
npm run start        # Démarrage production
npm run lint         # Vérification code
```

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT - voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
1. Vérifiez la documentation Azure et Vercel
2. Consultez les logs d'erreur dans la console
3. Ouvrez une issue sur GitHub

---

**Note** : Cette application est conçue pour des contenus générés par IA. Assurez-vous de respecter les droits d'auteur et les conditions d'utilisation des plateformes d'IA utilisées pour générer le contenu.