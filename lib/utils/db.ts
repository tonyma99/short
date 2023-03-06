import clientPromise from '@lib/utils/mongodb'
import client from '@lib/utils/redis'
import { ClientDetails } from '@lib/utils/helpers'
import { nanoid } from 'nanoid'

const LINKS_COLLECTION = 'links'

export const cache = async (key: string, callback: Function) => {
	if (!client.isReady) await client.connect()

	const cachedResult = await client.get(key)

	if (cachedResult) {
		return JSON.parse(cachedResult)
	} else {
		const result = await callback()
		if (result) {
			await client.setEx(key, 600, JSON.stringify(result))
			return result
		}
	}
}

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
