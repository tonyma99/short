import clientPromise from '@lib/mongodb'
import client from '@lib/redis'
import { ClientDetails } from '@lib/helpers'
import { nanoid } from 'nanoid'

const LINKS_COLLECTION = 'links'
const USERS_COLLECTION = 'users'

export const cache = async (key: string, callback: Function, timeout = 600) => {
	if (!client.isReady) {
		await client.connect()
	}

	const cachedResult = await client.get(key)

	if (cachedResult) {
		return JSON.parse(cachedResult)
	} else {
		const result = await callback()
		if (result) {
			await client.setEx(key, timeout, JSON.stringify(result))
			return result
		}
	}
}

export const Links = {
	get: async (id: string) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

		const result = await links.findOne({ id })

		return result
	},

	create: async (url: string, options?: { headers?: Headers; user?: string | null }) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

		const id = nanoid(8)
		const link = {
			id,
			target: url,
			date: new Date(),
			...(options && options.user && { user: options.user }),
			...(process.env.VERCEL === '1' &&
				options &&
				options.headers && { client: new ClientDetails(options.headers).get() })
		}

		const result = await links.insertOne(link)

		return result.insertedId ? id : null
	},

	update: async (id: string, options?: { headers?: Headers }) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

		await links.updateOne(
			{ id },
			{
				$push: {
					clicks: {
						date: new Date(),
						...(process.env.VERCEL === '1' &&
							options &&
							options.headers && { client: new ClientDetails(options.headers).get() })
					}
				}
			}
		)
	}
}

export const Users = {
	get: async (email: string) => {
		const db = (await clientPromise).db()
		const users = db.collection(USERS_COLLECTION)

		const result = await users.findOne({ email })

		return result
	},

	create: async (user: { email: string; name: string; oauth: string }) => {
		const db = (await clientPromise).db()
		const users = db.collection(USERS_COLLECTION)

		const result = await users.insertOne({
			...user,
			oauth: [user.oauth],
			links: [],
			createdAt: new Date(),
			lastLogin: new Date()
		})
	},

	update: async (email: string) => {
		const db = (await clientPromise).db()
		const users = db.collection(USERS_COLLECTION)

		await users.updateOne({ email }, { $set: { lastLogin: new Date() } })
	},

	link: async (email: string, id: string) => {
		const db = (await clientPromise).db()
		const users = db.collection(USERS_COLLECTION)

		await users.updateOne({ email }, { $push: { links: id } })
	}
}
