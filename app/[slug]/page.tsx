import { headers } from 'next/headers'
import styles from './page.module.css'
import RedirectModal from './RedirectModal'

const getUrl = async (id: string) => {
	const headersList = headers()
	const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https'
	const host = headersList.get('host')
	console.log(`${protocol}://${host}/api/expand?id=${id}`)
	const response = await fetch(`${protocol}://${host}/api/expand?id=${id}`, { cache: 'no-store' })
	const { url } = await response.json()
	return url
}

export default async function Redirect({ params }: { params: any }) {
	const { slug: id } = params
	const url = await getUrl(id)

	return (
		<div className={styles.modalContainer}>
			<RedirectModal url={url} />
		</div>
	)
}
