import { MongoClient } from 'mongodb'
import type { IncomingHttpHeaders } from 'http'
import { nanoid } from 'nanoid'
import { Client } from '@lib/utils/helpers'

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

/*****************************************************************************/
/*                             HELPER FUNCTIONS                              */
/*****************************************************************************/

export const getCollection = async (name: string | undefined) => {
  if (!name) {
    throw new Error('Invalid/Missing environment variable')
  }
  const db = (await clientPromise).db(process.env.MONGODB_DB)
  const collection = db.collection(name)
  return collection
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
  const links = await getCollection(process.env.MONGODB_LINKS)
  const result = await links.insertOne(link)
  if (result.insertedId) {
    return link
  } else {
    throw new Error()
  }
}

export const getLink = async (id: string) => {
  const links = await getCollection(process.env.MONGODB_LINKS)
  const result = await links.findOne({ id })
  if (result) {
    return result.target
  } else {
    throw new Error()
  }
}

export const updateLink = async (id: string) => {
  const links = await getCollection(process.env.MONGODB_LINKS)
  await links.updateOne(
    { id },
    {
      $push: {
        clicks: {
          date: new Date(),
        },
      },
    }
  )
}