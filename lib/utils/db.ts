import clientPromise from '@lib/utils/mongodb'
import { ClientDetails } from '@lib/utils/helpers'
import { nanoid } from 'nanoid'

const LINKS_COLLECTION = 'links'
const BLACKLIST_COLLECTION = 'blacklist'

export const Links = {
	get: async (id: string) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

		const result = await links.findOne({ id })

		return result ? result.target : null
	},

	create: async (url: string, headers?: Headers) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

		const id = nanoid(8)
		const link = {
			id,
			target: url,
			created: new Date(),
			...(process.env.VERCEL === '1' && headers && { client: new ClientDetails(headers).get() })
		}

		const result = await links.insertOne(link)

		return result.insertedId ? id : null
	},

	update: async (id: string) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

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
	check: async (url: string) => {
		const db = (await clientPromise).db()
		const blacklist = db.collection(BLACKLIST_COLLECTION)

		const host = new URL(url).hostname
		const result = await blacklist.findOne({ url: host })

		return result ? true : false
	},

	add: async (url: string, headers?: Headers) => {
		const db = (await clientPromise).db()
		const blacklist = db.collection(BLACKLIST_COLLECTION)

		const host = new URL(url).hostname

		await blacklist.insertOne({ url: host })
	}
}
