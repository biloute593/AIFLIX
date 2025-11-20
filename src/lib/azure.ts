import { MongoClient, Db, Collection } from 'mongodb'
import { BlobServiceClient } from '@azure/storage-blob'

// MongoDB - Lazy initialization
let mongoClient: MongoClient | null = null
let database: Db | null = null
let _usersCollection: Collection | null = null
let _contentsCollection: Collection | null = null

async function getMongoClient(): Promise<MongoClient> {
  if (!mongoClient) {
    // Use the MongoDB key for Cosmos DB MongoDB API
    const accountKey = process.env.AZURE_COSMOS_MONGODB_KEY

    if (accountKey) {
      // Use the direct MongoDB endpoint for Cosmos DB
      const accountName = 'cosmos-aiflix-eastus'

      // Direct MongoDB connection string for Cosmos DB
      const mongoConnectionString = `mongodb://${accountName}:${accountKey}@${accountName}.mongo.cosmos.azure.com:10255/?ssl=true&replicaSet=globaldb&retrywrites=false&maxIdleTimeMS=120000&appName=@${accountName}@`

      console.log('Using Cosmos DB MongoDB endpoint with dedicated key (East US)')

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
      throw new Error('Missing Cosmos DB MongoDB key')
    }
  }
  if (!mongoClient) {
    throw new Error('Failed to connect to MongoDB')
  }
  return mongoClient
}

async function getDatabase(): Promise<Db> {
  if (!database) {
    const client = await getMongoClient()
    // Hardcode database name to avoid encoding issues
    const dbName = 'aiflix'
    console.log('Using hardcoded database name:', dbName)
    database = client.db(dbName)
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
  // Try multiple possible environment variable names for storage key
  const accountName = process.env.AZURE_STORAGE_ACCOUNT_NAME_FINAL || process.env.AZURE_STORAGE_ACCOUNT_NAME
  const accountKey = process.env.AZURE_STORAGE_ACCOUNT_KEY_FINAL || process.env.AZURE_STORAGE_ACCOUNT_KEY || process.env.AZURE_STORAGE_ACCESS_KEY
  const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING_FINAL || process.env.AZURE_STORAGE_CONNECTION_STRING

  if (!blobServiceClient) {
    if (connectionString) {
      // Use connection string if available (preferred)
      console.log('Using Azure Storage connection string (FINAL config)')
      blobServiceClient = BlobServiceClient.fromConnectionString(connectionString)
    } else if (accountName && accountKey) {
      // Fallback to account name + key
      console.log('Using Azure Storage account name + key (FINAL config)')
      const connStr = `DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${accountKey};EndpointSuffix=core.windows.net`
      blobServiceClient = BlobServiceClient.fromConnectionString(connStr)
    } else {
      console.warn('Azure Storage not configured - missing connection string or account credentials')
    }
  }
  return blobServiceClient
}

export function getContainerClient() {
  const blobClient = getBlobServiceClient()
  const containerName = process.env.AZURE_STORAGE_CONTAINER_FINAL || process.env.AZURE_STORAGE_CONTAINER || process.env.AZURE_STORAGE_CONTAINER_NAME
  
  if (!_containerClient && blobClient && containerName) {
    console.log('Creating container client for:', containerName, '(FINAL config)')
    _containerClient = blobClient.getContainerClient(containerName)
  } else if (!blobClient) {
    console.warn('No blob service client available')
  } else if (!containerName) {
    console.warn('No container name configured')
  }
  return _containerClient
}