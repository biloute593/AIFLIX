@description('Name of the environment')
param environmentName string

@description('Location for all resources.')
param location string = resourceGroup().location

var resourceToken = uniqueString(subscription().id, resourceGroup().id, location, environmentName)

resource cosmosDb 'Microsoft.DocumentDB/databaseAccounts@2023-04-15' = {
  name: 'cosmos${resourceToken}'
  location: location
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

resource cosmosDbDatabase 'Microsoft.DocumentDB/databaseAccounts/mongodbDatabases@2023-04-15' = {
  parent: cosmosDb
  name: 'aiflix'
  properties: {
    resource: {
      id: 'aiflix'
    }
  }
}

resource storageAccount 'Microsoft.Storage/storageAccounts@2023-01-01' = {
  name: 'st${resourceToken}'
  location: location
  sku: {
    name: 'Standard_LRS'
  }
  kind: 'StorageV2'
  properties: {
    allowBlobPublicAccess: false
    allowSharedKeyAccess: false
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

resource blobService 'Microsoft.Storage/storageAccounts/blobServices@2023-01-01' = {
  parent: storageAccount
  name: 'default'
  properties: {}
}

resource blobContainer 'Microsoft.Storage/storageAccounts/blobServices/containers@2023-01-01' = {
  parent: blobService
  name: 'videos'
  properties: {
    publicAccess: 'None'
  }
}

resource appServicePlan 'Microsoft.Web/serverfarms@2022-09-01' = {
  name: 'plan${resourceToken}'
  location: location
  sku: {
    name: 'B1'
    tier: 'Basic'
  }
  properties: {
    reserved: true
  }
}

resource webApp 'Microsoft.Web/sites@2022-09-01' = {
  name: 'app${resourceToken}'
  location: location
  properties: {
    serverFarmId: appServicePlan.id
    siteConfig: {
      linuxFxVersion: 'NODE|18-lts'
      appSettings: [
        {
          name: 'AZURE_COSMOS_ENDPOINT'
          value: cosmosDb.properties.documentEndpoint
        }
        {
          name: 'AZURE_COSMOS_KEY'
          value: cosmosDb.listKeys().primaryMasterKey
        }
        {
          name: 'AZURE_COSMOS_DATABASE'
          value: 'aiflix'
        }
        {
          name: 'AZURE_STORAGE_ACCOUNT'
          value: storageAccount.name
        }
        {
          name: 'AZURE_STORAGE_KEY'
          value: storageAccount.listKeys().keys[0].value
        }
        {
          name: 'AZURE_STORAGE_CONTAINER'
          value: 'videos'
        }
      ]
    }
    httpsOnly: true
  }
  tags: {
    'azd-service-name': 'aiflix'
  }
}

output AZURE_COSMOS_ENDPOINT string = cosmosDb.properties.documentEndpoint
output AZURE_COSMOS_KEY string = cosmosDb.listKeys().primaryMasterKey
output AZURE_STORAGE_ACCOUNT string = storageAccount.name
output AZURE_STORAGE_KEY string = storageAccount.listKeys().keys[0].value