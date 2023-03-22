import { Links } from '@lib/db'
import { headers } from 'next/headers'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id') as string

		const headersList = headers()

		const url = await Links.get(id)

		if (url) {
			await Links.update(id, { headers: headersList })
			return new Response(JSON.stringify({ url }))
		} else {
			return new Response('The specified code is invalid.', { status: 400 })
		}
	} catch {
		return new Response('Internal server error.', { status: 500 })
	}
}
