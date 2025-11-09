import { MongoClient, Db, Collection } from 'mongodb'
import { BlobServiceClient } from '@azure/storage-blob'

// MongoDB - Lazy initialization
let mongoClient: MongoClient | null = null
let database: Db | null = null
let _usersCollection: Collection | null = null
let _contentsCollection: Collection | null = null

async function getMongoClient(): Promise<MongoClient> {
  if (!mongoClient) {
    // Use the full MongoDB connection string for Cosmos DB
    const connectionString = process.env.AZURE_COSMOS_CONNECTION_STRING

    if (connectionString) {
      console.log('Using Cosmos DB MongoDB connection string')

      mongoClient = new MongoClient(connectionString, {
        // Options for Cosmos DB MongoDB API compatibility
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        minPoolSize: 0,
        maxIdleTimeMS: 30000,
      })

      await mongoClient.connect()
    } else {
      throw new Error('Missing Cosmos DB connection string')
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