import { MongoClient, type Db } from "mongodb"

const uri = process.env.MONGODB_URI
const dbName = process.env.MONGODB_DB || "oneclick"

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getClientPromise(): Promise<MongoClient> {
  if (!uri) {
    throw new Error("Missing MONGODB_URI environment variable")
  }
  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
  }
  return global._mongoClientPromise
}

export async function getDb(): Promise<Db> {
  const client = await getClientPromise()
  return client.db(dbName)
}

export function isDbConfigured(): boolean {
  return Boolean(uri)
}
