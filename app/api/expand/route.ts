import { Links } from '@lib/utils/db'

export async function GET(request: Request) {
	try {
		const { searchParams } = new URL(request.url)
		const id = searchParams.get('id') as string

		try {
			const links = new Links()
			await links.connect()
			const url = await links.get(id)
			await links.update(id)
			return new Response(url)
		} catch {
			return new Response('The specified code is invalid.', { status: 400 })
		}
	} catch {
		return new Response('Internal server error.', { status: 500 })
	}
}
