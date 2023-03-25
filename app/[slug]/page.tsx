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
	return {}
}

export default async function Redirect({ params }: { params: any }) {
	const { slug: id } = params
	const { target: url, user } = await getUrl(id)

	if (!url) throw redirect('/')
	if (user) throw redirect(url)

	const safeBrowsingResult = {
		match: await safeBrowsingLookup(url),
		timestamp: new Date().toISOString()
	}

	return (
		<div className="flex flex-1 flex-col items-center justify-center w-screen px-4">
			<RedirectModal url={url} safeBrowsingResult={safeBrowsingResult} />
		</div>
	)
}
