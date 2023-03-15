import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { RedirectModal } from '@components'
import { safeBrowsingLookup } from '@lib/helpers'

const getUrl = async (id: string) => {
	const headersList = headers()
	const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
	const host = headersList.get('host')
	const response = await fetch(`${protocol}://${host}/api/expand?id=${id}`, { cache: 'no-store' })
	if (response.ok) {
		const { url } = await response.json()
		return url
	}
}

export default async function Redirect({ params }: { params: any }) {
	const { slug: id } = params
	const url = await getUrl(id)

	if (!url) throw redirect('/')

	const safeBrowsingResult = {
		match: await safeBrowsingLookup(url),
		timestamp: new Date().toLocaleTimeString()
	}

	return (
		<div className="flex items-center justify-center h-screen w-screen px-4">
			<RedirectModal url={url} safeBrowsingResult={safeBrowsingResult} />
		</div>
	)
}
