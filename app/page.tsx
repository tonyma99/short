import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from './page.module.css'
import { CreateLinkForm } from '@lib/components'

const inter = Inter({ subsets: ['latin'] })
const inter900 = Inter({ weight: '900', subsets: ['latin'] })

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<p>
					Currently a WIP, see version 1&nbsp;
					<a href="https://short-git-v1-tonyma.vercel.app">here</a>.
				</p>
				<div>
					<a href="https://github.com/tonyma99/short" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
					<a
						href="https://tonyma.notion.site/Short-ce453964971d4d288b83a194b8e35be3"
						target="_blank"
						rel="noopener noreferrer"
					>
						Notion
					</a>
				</div>
			</div>

			<div className={styles.center}>
				<div className={styles.logo}>🔗</div>
				<CreateLinkForm />
			</div>

			<div />
		</main>
	)
}
