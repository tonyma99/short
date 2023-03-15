import styles from './page.module.css'
import { CreateLinkForm } from '@components'

export default function Home() {
	return (
		<main className={styles.main}>
			<div className={styles.description}>
				<p>
					Work in progress, see version 1&nbsp;
					<a href="https://v1.short.tonyma.ca">here</a>
				</p>
				<div>
					<a
						href="https://tonyma.notion.site/Short-ce453964971d4d288b83a194b8e35be3"
						target="_blank"
						rel="noopener noreferrer"
					>
						Features
					</a>
					<a href="https://github.com/tonyma99/short" target="_blank" rel="noopener noreferrer">
						GitHub
					</a>
				</div>
			</div>

			<div className={styles.center}>
				<div className={styles.logo}>🔗</div>
				<CreateLinkForm />
			</div>

			<span></span>
		</main>
	)
}
