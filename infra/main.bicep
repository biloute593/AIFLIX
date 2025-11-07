@description('Name of the environment')
param environmentName string = 'aiflix'

@description('Location for all resources.')
param location string = resourceGroup().location

var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)

// Deploy Cosmos DB with MongoDB API
resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2024-08-15' = {
  name: 'cosmos${resourceToken}'
  location: location
  kind: 'MongoDB'
  properties: {
    databaseAccountOfferType: 'Standard'
    locations: [
      {
        locationName: location
        failoverPriority: 0
        isZoneRedundant: false
      }
    ]
    capabilities: [
      {
        name: 'EnableMongo'
      }
    ]
    enableAutomaticFailover: false
    enableMultipleWriteLocations: false
    enablePartitionMerge: false
    isVirtualNetworkFilterEnabled: false
    virtualNetworkRules: []
    ipRules: []
    consistencyPolicy: {
      defaultConsistencyLevel: 'Session'
      maxIntervalInSeconds: 5
      maxStalenessPrefix: 100
    }
    enableFreeTier: false
    enableAnalyticalStorage: false
    createMode: 'Default'
    backupPolicy: {
      type: 'Periodic'
      periodicModeProperties: {
        backupIntervalInMinutes: 240
        backupRetentionIntervalInHours: 8
        backupStorageRedundancy: 'Local'
      }
    }
    cors: []
    networkAclBypass: 'None'
    networkAclBypassResourceIds: []
  }
  tags: {}
}

// Create AIFLIX database in Cosmos DB
resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2024-08-15' = {
  parent: cosmosDb
  name: 'aiflix'
  properties: {
    resource: {
      id: 'aiflix'
    }
  }
}

// Deploy Storage Account
resource storageAccount 'Microsoft.Storage/storageAccounts@2024-01-01' = {
  name: 'st${resourceToken}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: true
    minimumTlsVersion: 'TLS1_2'
    supportsHttpsTrafficOnly: true
    encryption: {
      services: {
        blob: {
          enabled: true
        }
        file: {
          enabled: true
        }
      }
      keySource: 'Microsoft.Storage'
    }
    accessTier: 'Hot'
    networkAcls: {
      bypass: 'AzureServices'
      virtualNetworkRules: []
      ipRules: []
      defaultAction: 'Allow'
    }
  }
}

// Create blob service and container
resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2024-01-01' = {
  parent: storageAccount
  name: 'default'
  properties: {}
}

resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2024-01-01' = {
  parent: blobService
  name: 'videos'
  properties: {
    publicAccess: 'None'
  }
}

// Outputs for Vercel environment variables
output AZURE_COSMOS_CONNECTION_STRING string = cosmosDb.properties.documentEndpoint
output AZURE_COSMOS_ENDPOINT string = cosmosDb.properties.documentEndpoint
output AZURE_COSMOS_KEY string = cosmosDb.listKeys().primaryMasterKey
output AZURE_COSMOS_DATABASE string = 'aiflix'
output AZURE_STORAGE_ACCOUNT_NAME string = storageAccount.name
output AZURE_STORAGE_ACCOUNT_KEY string = storageAccount.listKeys().keys[0].value
output AZURE_STORAGE_CONNECTION_STRING string = 'DefaultEndpointsProtocol=https;AccountName=${storageAccount.name};AccountKey=${storageAccount.listKeys().keys[0].value};EndpointSuffix=core.windows.net'
output AZURE_STORAGE_CONTAINER string = 'videos'