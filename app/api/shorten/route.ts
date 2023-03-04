import { Blacklist, Links } from '@lib/utils/db'
import { completeUrl, validateUrl } from '@lib/utils/helpers'

export async function POST(request: Request) {
	try {
		const { headers } = request
		const { searchParams } = new URL(request.url)
		const host = headers.get('host')
		const target = searchParams.get('target') as string

		if (!target) {
			return new Response("Missing parameter 'target'.", { status: 400 })
		}

		const url = completeUrl(target)

		if (!validateUrl(url)) {
			return new Response('The specified URL is not valid.', { status: 400 })
		}

		await Blacklist.connect()
		if (await Blacklist.check(url)) {
			return new Response('The specified URL is not allowed.', { status: 400 })
		}

		await Links.connect()
		const id = await Links.create(url, headers)

		return new Response(
			JSON.stringify({
				url: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${host}/${id}`
			})
		)
	} catch {
		return new Response('Internal server error', { status: 500 })
	}
}
