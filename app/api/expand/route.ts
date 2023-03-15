import { Links } from '@lib/db'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id') as string

		await Links.update(id)
		const url = await Links.get(id)

		if (url) {
			return new Response(JSON.stringify({ url }))
		} else {
			return new Response('The specified code is invalid.', { status: 400 })
		}
	} catch {
		return new Response('Internal server error.', { status: 500 })
	}
}
