import { MongoClient } from 'mongodb'
import { nanoid } from 'nanoid'
import { Client } from '@lib/utils/helpers'
import type { Collection } from 'mongodb'

if (!process.env.MONGODB_URI) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_URI"')
}

if (!process.env.MONGODB_LINKS) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_LINKS"')
}

if (!process.env.MONGODB_DB) {
	throw new Error('Invalid/Missing environment variable: "MONGODB_DB"')
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

export class Links {
	links: Collection<Link> | null

	constructor() {
		this.links = null
	}

	connect = async () => {
		const db = (await clientPromise).db(process.env.MONGODB_DB)
		const links = db.collection<Link>(process.env.MONGODB_LINKS)
		this.links = links
	}

	get = async (id: string) => {
		try {
			const links = this.links as Collection<Link>
			const result = await links.findOne({ id })
			if (result) {
				return result.target
			}
		} catch {}
	}

	create = async (url: string, headers?: Headers) => {
		const id = nanoid(8)
		const link = {
			id,
			target: url,
			created: new Date(),
			...(headers && process.env.VERCEL === '1' && { client: new Client(headers).get() })
		}
		const links = this.links as Collection<Link>
		const result = await links.insertOne(link)
		if (result.insertedId) {
			return link
		} else {
			throw new Error()
		}
	}

	update = async (id: string) => {
		const links = this.links as Collection<Link>
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
