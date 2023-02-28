import { Links } from '@lib/utils/db'
import { completeUrl, lookupSafeBrowsing, validateUrl } from '@lib/utils/helpers'

export async function POST(request: Request) {
	try {
		const { headers } = request
		const { searchParams } = new URL(request.url)
		const target = searchParams.get('target') as string

		const url = completeUrl(target)

		if (!(validateUrl(url) && (await lookupSafeBrowsing(url)))) {
			return new Response('The specified URL is not allowed.', { status: 400 })
		}
		const links = new Links()
		await links.connect()
		const { id } = await links.create(url, headers)
		const host = headers.get('host')
		return new Response(
			JSON.stringify({
				url: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${host}/${id}`
			})
		)
	} catch {
		return new Response('Internal server error', { status: 500 })
	}
}
