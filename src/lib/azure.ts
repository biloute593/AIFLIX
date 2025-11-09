import { MongoClient, Db, Collection } from 'mongodb'
import { BlobServiceClient } from '@azure/storage-blob'

// MongoDB - Lazy initialization
let mongoClient: MongoClient | null = null
let database: Db | null = null
let _usersCollection: Collection | null = null
let _contentsCollection: Collection | null = null

async function getMongoClient(): Promise<MongoClient> {
  if (!mongoClient) {
    // For Cosmos DB MongoDB API, we need to construct the MongoDB connection string
    const endpoint = process.env.AZURE_COSMOS_ENDPOINT
    const accountKey = process.env.AZURE_COSMOS_KEY

    if (endpoint && accountKey) {
      // Extract account name from endpoint
      const accountName = endpoint.replace('https://', '').replace('.documents.azure.com', '').replace(/:\d+\/?$/, '')

      // For Cosmos DB MongoDB API, use the key directly (same key works for both APIs)
      const mongoConnectionString = `mongodb://${accountName}:${accountKey}@${accountName}.mongo.cosmos.azure.com:10255/aiflix?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000`

      console.log('Account name:', accountName)
      console.log('Using direct key for MongoDB API')

      mongoClient = new MongoClient(mongoConnectionString, {
        // Options for Cosmos DB MongoDB API compatibility
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
      })

      await mongoClient.connect()
    } else {
      throw new Error('Missing Cosmos DB endpoint or key')
    }
  }
  if (!mongoClient) {
    throw new Error('Failed to connect to MongoDB')
  }
  return mongoClient
}

async function getDatabase(): Promise<Db> {
  if (!database && process.env.AZURE_COSMOS_DATABASE) {
    const client = await getMongoClient()
    database = client.db(process.env.AZURE_COSMOS_DATABASE)
  }
  if (!database) {
    throw new Error('Failed to get database')
  }
  return database
}

export async function getUsersCollection(): Promise<Collection> {
  if (!_usersCollection) {
    const db = await getDatabase()
    _usersCollection = db.collection('users')
  }
  return _usersCollection
}

export async function getContentsCollection(): Promise<Collection> {
  if (!_contentsCollection) {
    const db = await getDatabase()
    _contentsCollection = db.collection('contents')
  }
  return _contentsCollection
}

// Blob Storage - Lazy initialization
let blobServiceClient: any = null
let _containerClient: any = null

function getBlobServiceClient() {
  if (!blobServiceClient && process.env.AZURE_STORAGE_ACCOUNT_NAME && process.env.AZURE_STORAGE_ACCOUNT_KEY) {
    const connectionString = `DefaultEndpointsProtocol=https;AccountName=${process.env.AZURE_STORAGE_ACCOUNT_NAME};AccountKey=${process.env.AZURE_STORAGE_ACCOUNT_KEY};EndpointSuffix=core.windows.net`
    blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
  }
  return blobServiceClient
}

export function getContainerClient() {
  if (!_containerClient && getBlobServiceClient() && process.env.AZURE_STORAGE_CONTAINER) {
    _containerClient = getBlobServiceClient().getContainerClient(process.env.AZURE_STORAGE_CONTAINER)
  }
  return _containerClient
}