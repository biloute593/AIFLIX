import { CosmosClient } from '@azure/cosmos'
import { BlobServiceClient } from '@azure/storage-blob'

// Cosmos DB - Lazy initialization
let cosmosClient: CosmosClient | null = null
let database: any = null
let _usersContainer: any = null
let _contentsContainer: any = null

function getCosmosClient() {
  if (!cosmosClient && process.env.AZURE_COSMOS_CONNECTION_STRING) {
    // Extract endpoint and key from connection string
    // Format: AccountEndpoint=https://xxx.documents.azure.com:443/;AccountKey=yyy;
    const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING
    const endpointMatch = connectionString.match(/AccountEndpoint=([^;]+)/)
    const keyMatch = connectionString.match(/AccountKey=([^;]+)/)

    if (endpointMatch && keyMatch) {
      cosmosClient = new CosmosClient({
        endpoint: endpointMatch[1],
        key: keyMatch[1]
      })
    }
  }
  return cosmosClient
}

function getDatabase() {
  if (!database && getCosmosClient() && process.env.AZURE_COSMOS_DATABASE) {
    database = getCosmosClient()!.database(process.env.AZURE_COSMOS_DATABASE)
  }
  return database
}

export function getUsersContainer() {
  if (!_usersContainer && getDatabase()) {
    _usersContainer = getDatabase().container('users')
  }
  return _usersContainer
}

export function getContentsContainer() {
  if (!_contentsContainer && getDatabase()) {
    _contentsContainer = getDatabase().container('contents')
  }
  return _contentsContainer
}

// Blob Storage - Lazy initialization
let blobServiceClient: any = null
let _containerClient: any = null

function getBlobServiceClient() {
  if (!blobServiceClient && process.env.AZURE_STORAGE_ACCOUNT_NAME && process.env.AZURE_STORAGE_ACCESS_KEY) {
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCESS_KEY};EndpointSuffix=core.windows.net`
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  }
  return blobServiceClient
}

export function getContainerClient() {
  if (!_containerClient && getBlobServiceClient() && process.env.AZURE_STORAGE_CONTAINER_NAME) {
    _containerClient = getBlobServiceClient().getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME)
  }
  return _containerClient
}