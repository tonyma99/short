import { Links } from '@lib/db'
import { completeUrl, safeBrowsingLookup, validateUrl } from '@lib/helpers'
import { getServerSession } from 'next-auth/next'

export async function POST(request: Request) {
	try {
		const { headers } = request
		const { searchParams } = new URL(request.url)
		const host = headers.get('host')
		const target = searchParams.get('target') as string

		const session = await getServerSession()

		if (!target) {
			return new Response('No URL was specified.', { status: 400 })
		}

		const url = completeUrl(target)

		if (!validateUrl(url)) {
			return new Response('The specified URL is not valid.', { status: 400 })
		}

		if (await safeBrowsingLookup(url)) {
			return new Response('The specified URL is not allowed.', { status: 400 })
		}

		const id = await Links.create(url, { headers, user: session?.user?.email })

		return new Response(
			JSON.stringify({
				url: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${host}/${id}`
			})
		)
	} catch {
		return new Response('Internal server error', { status: 500 })
	}
}
