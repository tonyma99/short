'use client'
import styles from './RedirectModal.module.css'
import { useRouter } from 'next/navigation'
import { Inter } from 'next/font/google'
import Image from 'next/image'
import Link from 'next/link'

const inter = Inter({ subsets: ['latin'] })
const descriptionText =
	'This redirect may potentially be harmful. Continue only if you trust the source to avoid malware, viruses, or phishing scams.'
const tooltipText =
	'This warning prompt appears when the link is created by an unauthenticated user.'

export default function RedirectModal({ url }: { url: string }) {
	const router = useRouter()

	const handleClick = () => {
		router.push(url)
	}
	return (
		<div className={styles.center}>
			<div className={[styles.modal, inter.className].join(' ')}>
				<div className={styles.title}>
					<h3 className={styles.heading}>You are being redirected to</h3>
					<Link href={url} className={styles.subheading}>
						{url}
					</Link>
				</div>
				<div className={styles.body}>
					<div className={styles.description}>
						<span className={styles.descriptionText}>{descriptionText}</span>
						<span className={styles.tooltip} data-tooltip={tooltipText}>
							<Image src="/info.svg" alt="Information icon" width={20} height={20} priority />
						</span>
					</div>
					<button onClick={handleClick} className={styles.button}>
						Continue
					</button>
				</div>
			</div>
		</div>
	)
}
