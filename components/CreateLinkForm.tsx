'use client'
import { Button, TextInput } from '@components'
import { FormEvent, useState } from 'react'

export default function CreateLinkForm() {
	const [value, setValue] = useState('')
	const [url, setUrl] = useState('')
	const [error, setError] = useState('')
	const [waiting, setWaiting] = useState(false)

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		const target = value
		setWaiting(true)
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
		setWaiting(false)
	}

	return (
		<div className="w-full max-w-[480px]">
			<form onSubmit={handleSubmit} noValidate>
				<TextInput
					value={value}
					name="url"
					type="url"
					placeholder="https://google.com"
					onChange={(e: any) => setValue(e.target.value)}
					required
					disabled={waiting}
					button="Submit"
				/>
				<input type="submit" disabled={waiting} hidden />
			</form>
			{url && (
				<div className="bg-gray-100 mt-4 rounded-md p-4 text-center text-sm max-w-[320px]	mx-auto">
					<a
						className="text-blue-500 font-bold hover:text-blue-600 transition-all"
						href={url}
						target="_blank"
					>
						{url}
					</a>
					<p className="mt-2">
						This link prompts the user to confirm the destination before proceeding. To remove this
						prompt, please{' '}
						<a className="text-blue-500 hover:text-blue-600 animate-all" href="/">
							login
						</a>{' '}
						or{' '}
						<a className="text-blue-500 hover:text-blue-600 animate-all" href="/">
							create an account
						</a>
						.
					</p>
				</div>
			)}
			{error && (
				<div className="bg-red-100 mt-4 rounded-md p-3 text-center text-sm w-fit mx-auto">
					<p>{error}</p>
				</div>
			)}
		</div>
	)
}
