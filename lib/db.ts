import clientPromise from '@lib/mongodb'
import client from '@lib/redis'
import { ClientDetails } from '@lib/helpers'
import { nanoid } from 'nanoid'

const LINKS_COLLECTION = 'links'

export const cache = async (key: string, callback: Function, timeout = 600) => {
	const _start = performance.now()

	if (!client.isReady) {
		await client.connect()
		process.env.NODE_ENV === 'development' &&
			console.log(
				`\x1b[41mredis\x1b[0m - \x1b[33mclient connected\x1b[0m in ${
					(performance.now() - _start) | 0
				}ms`
			)
	}

	const cachedResult = await client.get(key)

	if (cachedResult) {
		process.env.NODE_ENV === 'development' &&
			console.log(
				`\x1b[41mredis\x1b[0m - \x1b[32mcache hit\x1b[0m \x1b[2m${key}\x1b[0m in ${
					(performance.now() - _start) | 0
				}ms`
			)
		return JSON.parse(cachedResult)
	} else {
		const result = await callback()
		if (result) {
			await client.setEx(key, timeout, JSON.stringify(result))
			process.env.NODE_ENV === 'development' &&
				console.log(
					`\x1b[41mredis\x1b[0m - \x1b[31mcache miss\x1b[0m \x1b[2m${key}\x1b[0m in ${
						(performance.now() - _start) | 0
					}ms`
				)
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
			date: new Date(),
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
