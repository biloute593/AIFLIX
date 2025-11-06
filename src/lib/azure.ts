import { CosmosClient } from '@azure/cosmos'
import { BlobServiceClient } from '@azure/storage-blob'

// Cosmos DB
const cosmosEndpoint = process.env.AZURE_COSMOS_ENDPOINT!
const cosmosKey = process.env.AZURE_COSMOS_KEY!
const databaseId = process.env.AZURE_COSMOS_DATABASE!

export const cosmosClient = new CosmosClient({ endpoint: cosmosEndpoint, key: cosmosKey })
export const database = cosmosClient.database(databaseId)
export const usersContainer = database.container('users')
export const contentsContainer = database.container('contents')

// Blob Storage
const storageAccount = process.env.AZURE_STORAGE_ACCOUNT!
const storageKey = process.env.AZURE_STORAGE_KEY!
const containerName = process.env.AZURE_STORAGE_CONTAINER!

export const blobServiceClient = BlobServiceClient.fromConnectionString(
  `DefaultEndpointsProtocol=https;AccountName=${storageAccount};AccountKey=${storageKey};EndpointSuffix=core.windows.net`
)
export const containerClient = blobServiceClient.getContainerClient(containerName)