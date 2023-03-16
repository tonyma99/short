import clientPromise from '@lib/mongodb'
import client from '@lib/redis'
import { ClientDetails } from '@lib/helpers'
import { nanoid } from 'nanoid'

const LINKS_COLLECTION = 'links'

export const cache = async (key: string, callback: Function, timeout = 600) => {
	const _start = performance.now()

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

	create: async (url: string, options: { headers?: Headers; user?: string | null }) => {
		const db = (await clientPromise).db()
		const links = db.collection(LINKS_COLLECTION)

		const id = nanoid(8)
		const link = {
			id,
			target: url,
			date: new Date(),
			...(options.user && { user: options.user }),
			...(process.env.VERCEL === '1' &&
				options.headers && { client: new ClientDetails(options.headers).get() })
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
