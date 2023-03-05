import styles from './page.module.css'
import { redirect } from 'next/navigation'
import RedirectModal from './RedirectModal'

export default async function Redirect({ params }: { params: any }) {
	const { slug } = params
	const response = await fetch(`http://localhost:3000/api/expand?id=${slug}`, { cache: 'no-store' })
	const { url } = await response.json()

	return (
		<div className={styles.modalContainer}>
			<RedirectModal url={url} />
		</div>
	)
}
