import { MongoClient } from 'mongodb'
import type { IncomingHttpHeaders } from 'http'
import { nanoid } from 'nanoid'
import { Client } from '@lib/utils'

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

const uri = process.env.MONGODB_URI
const options = {}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise

export const linksCollection = async () => {
  if (!process.env.MONGODB_LINKS || !process.env.MONGODB_DB) {
    throw new Error(
      'Invalid/Missing environment variable(s): "MONGODB_DB" or "MONGODB_LINKS'
    )
  }
  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DB)
  const links = db.collection<Link>(process.env.MONGODB_LINKS)
  return links
}

export const createLink = async (
  url: string,
  headers?: IncomingHttpHeaders
) => {
  const id = nanoid(8)
  const link = {
    id,
    target: url,
    created: new Date(),
    ...(headers &&
      process.env.VERCEL === '1' && { client: new Client(headers).get() }),
  }
  const links = await linksCollection()
  const result = await links.insertOne(link)
  if (result.insertedId) {
    return link
  } else {
    throw new Error()
  }
}

export const getLink = async (id: string | string[]) => {
  const links = await linksCollection()
  const result = await links.findOne({ id })
  if (result) {
    return result.target
  } else {
    throw new Error()
  }
}

export const updateLink = async (
  id: string | string[],
  headers?: IncomingHttpHeaders
) => {
  const links = await linksCollection()
  await links.updateOne(
    { id },
    {
      $push: {
        clicks: {
          date: new Date(),
          ...(headers &&
            process.env.VERCEL === '1' && {
              client: new Client(headers).get(),
            }),
        },
      },
    }
  )
}
