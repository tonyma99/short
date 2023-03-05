import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import styles from './page.module.css'
import { RedirectModal } from '@lib/components'

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

	return (
		<div className={styles.modalContainer}>
			<RedirectModal url={url} />
		</div>
	)
}
