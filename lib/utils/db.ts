import { MongoClient } from 'mongodb'
import type { Collection } from 'mongodb'
import { ClientDetails } from '@lib/utils/helpers'
import { nanoid } from 'nanoid'

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

let links: Collection<Link>
let blacklist: Collection

export const Links = {
	connect: async () => {
		if (links === undefined) {
			const db = (await clientPromise).db(process.env.MONGODB_DB)
			links = db.collection<Link>(process.env.MONGODB_LINKS)
		}
	},
	get: async (id: string) => {
		const result = await links.findOne({ id })
		if (result) {
			return result.target
		}
	},
	create: async (url: string, headers?: Headers) => {
		const id = nanoid(8)
		const link = {
			id,
			target: url,
			created: new Date(),
			...(headers && process.env.VERCEL === '1' && { client: new ClientDetails(headers).get() })
		}
		const result = await links.insertOne(link)
		if (result.insertedId) {
			return link.id
		}
	},
	update: async (id: string) => {
		await links.updateOne(
			{ id },
			{
				$push: {
					clicks: {
						date: new Date()
					}
				}
			}
		)
	}
}

export const Blacklist = {
	connect: async () => {
		if (blacklist === undefined) {
			const db = (await clientPromise).db(process.env.MONGODB_DB)
			blacklist = db.collection(process.env.MONGODB_BLACKLIST)
		}
	},
	check: async (url: string) => {
		const host = new URL(url).hostname
		const result = await blacklist.findOne({ url: host })
		if (result?._id) {
			return true
		} else {
			return false
		}
	},
	add: async (url: string, headers?: Headers) => {
		const host = new URL(url).hostname
		await blacklist.insertOne({
			url: host,
			date: new Date(),
			...(headers && process.env.VERCEL === '1' && { client: new ClientDetails(headers).get() })
		})
	}
}
