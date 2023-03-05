'use client'
import { FormEvent, useState } from 'react'
import styles from './CreateLinkForm.module.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export default function CreateLinkForm() {
	const [value, setValue] = useState('')
	const [url, setUrl] = useState('')
	const [error, setError] = useState('')

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		const target = value
		setValue('')
		setUrl('')
		setError('')
		const response = await fetch(`/api/shorten?target=${target}`, { method: 'POST' })
		if (response.status === 200) {
			const { url: _url } = await response.json()
			setUrl(_url)
		} else {
			const message = await response.text()
			setError(message)
		}
	}

	return (
		<div>
			<form className={styles.form} onSubmit={handleSubmit} noValidate>
				<input
					value={value}
					name="url"
					type="url"
					placeholder="https://google.com"
					onChange={(e) => setValue(e.target.value)}
					required
				/>
				<input type="submit" hidden />
			</form>
			{url && (
				<div className={styles.alert}>
					<a className={[styles.link, styles.mono].join(' ')} href={url} target="_blank">
						{url}
					</a>
					<p className={[styles.noUserAlert, inter.className].join(' ')}>
						This link prompts the user to confirm the destination before proceeding. To remove this
						prompt, please{' '}
						<a className={styles.link} href="/">
							login
						</a>{' '}
						or{' '}
						<a className={styles.link} href="/">
							create an account
						</a>
						.
					</p>
				</div>
			)}
			{error && (
				<div className={[styles.alert, styles.errorAlert, inter.className].join(' ')}>
					<p>{error}</p>
				</div>
			)}
		</div>
	)
}
