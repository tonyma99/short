'use client'
import { Button, TextInput } from '@components'
import { FormEvent, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function CreateLinkForm() {
	const [value, setValue] = useState('')
	const [url, setUrl] = useState('')
	const [error, setError] = useState('')
	const [waiting, setWaiting] = useState(false)
	const [copyButtonText, setCopyButtonText] = useState<'Copy' | 'Copied'>('Copy')

	const { data: session } = useSession()

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()
		const target = value
		setWaiting(true)
		setValue('')
		setUrl('')
		setError('')

		const response = await fetch(`/api/shorten?target=${target}&user=${session?.user?.email}`, {
			method: 'POST'
		})

		if (response.status === 200) {
			const { url: _url } = await response.json()
			setUrl(_url)
		} else {
			const message = await response.text()
			setError(message)
		}
		setWaiting(false)
	}

	const handleCopy = async () => {
		navigator.clipboard.writeText(url)
		setCopyButtonText('Copied')
		setTimeout(() => {
			setCopyButtonText('Copy')
		}, 1000)
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
					button="Shorten"
				/>
				<input type="submit" disabled={waiting} hidden />
			</form>
			{url && (
				<div className="bg-gray-100 mt-6 rounded-md p-2 text-center text-sm w-min	mx-auto">
					<div className="flex items-center justify-center gap-2">
						<a
							className="text-blue-500 font-bold hover:text-blue-600 transition-colors block whitespace-nowrap"
							href={url}
							target="_blank"
						>
							{url}
						</a>
						<Button
							className="!p-2 !text-xs !font-semibold"
							text={copyButtonText}
							handler={handleCopy}
						/>
					</div>
				</div>
			)}
			{error && (
				<div className="bg-red-100 mt-6 rounded-md p-3 text-center text-sm w-fit mx-auto">
					<p>{error}</p>
				</div>
			)}
		</div>
	)
}
