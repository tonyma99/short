import { Links } from '@lib/db'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id') as string
		const { headers } = request

		const url = await Links.get(id)

		if (url) {
			await Links.update(id, { headers })
			return new Response(JSON.stringify({ url }))
		} else {
			return new Response('The specified code is invalid.', { status: 400 })
		}
	} catch {
		return new Response('Internal server error.', { status: 500 })
	}
}
