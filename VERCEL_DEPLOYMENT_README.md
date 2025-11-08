# AIFLIX - Netflix-like Application Deployment Guide

## Overview
AIFLIX is a Netflix-like streaming application built with Next.js 14, TypeScript, and Azure backend services.

## Architecture
- **Frontend**: Next.js 14 with App Router, TypeScript, Tailwind CSS
- **Backend**: Azure Cosmos DB (MongoDB API), Azure Blob Storage
- **Authentication**: JWT with bcrypt password hashing
- **Deployment**: Vercel (frontend), Azure (backend services)

## Azure Infrastructure
The application uses the following Azure resources:
- **Cosmos DB Account**: `your-cosmos-account` (MongoDB API)
- **Database**: `aiflix`
- **Storage Account**: `your-storage-account`
- **Container**: `videos` (private blob container)

## Environment Variables for Vercel

Copy these environment variables to your Vercel project settings:

### Azure Cosmos DB
```
AZURE_COSMOS_ENDPOINT=https://your-cosmos-account.documents.azure.com:443/
AZURE_COSMOS_KEY=your-cosmos-key-here
AZURE_COSMOS_DATABASE=aiflix
AZURE_COSMOS_CONNECTION_STRING=https://your-cosmos-account.documents.azure.com:443/
```

### Azure Storage
```
AZURE_STORAGE_ACCOUNT_NAME=your-storage-account-name
AZURE_STORAGE_ACCOUNT_KEY=your-storage-account-key-here
AZURE_STORAGE_CONNECTION_STRING=DefaultEndpointsProtocol=https;AccountName=your-storage-account-name;AccountKey=your-storage-account-key-here;EndpointSuffix=core.windows.net
AZURE_STORAGE_CONTAINER=videos
```

### JWT Secret
```
JWT_SECRET=your-super-secure-jwt-secret-here-change-this-in-production
```

## Vercel Deployment Steps

1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Environment Variables**: Add all the variables listed above in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy on git push

## Local Development

1. Copy `.env.example` to `.env.local` and fill in your actual values
2. Install dependencies: `npm install`
3. Run development server: `npm run dev`

## Features

- User registration and authentication
- Video upload to Azure Blob Storage
- Video streaming from Azure Storage
- Browse and watch videos
- JWT-based session management

## Security Notes

- Never commit `.env.local` to version control
- Generate a new secure JWT secret for production
- Azure keys have full access - consider using managed identities in production
- Storage container is private - implement proper access controls

## Troubleshooting

- **Connection Issues**: Verify all environment variables are set correctly in Vercel
- **CORS Issues**: Azure services are configured for cross-origin requests
- **Authentication Issues**: Check JWT secret consistency between deployments