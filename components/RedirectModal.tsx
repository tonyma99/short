'use client'
import { Button, Modal } from '@components'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function RedirectModal({
	url,
	safeBrowsingResult
}: {
	url: string
	safeBrowsingResult: any
}) {
	const [loaded, setLoaded] = useState(false)
	const [time, setTime] = useState('')
	useEffect(() => {
		setTime(new Date(safeBrowsingResult.timestamp).toLocaleTimeString())
		setLoaded(true)
	}, [safeBrowsingResult])

	const descriptionText =
		'This redirect may potentially be harmful. Continue only if you trust the source to avoid malware, viruses, or phishing scams. This warning appears when the link is created by an unauthenticated user.'

	const router = useRouter()

	const handleClick = () => {
		router.push(url)
	}

	return (
		<>
			{loaded ? (
				<Modal>
					<div className="flex flex-col gap-4 text-center text-sm">
						<div>
							<h3 className="font-bold text-base">You are being redirected to</h3>
							<a className="text-blue-500 hover:text-blue-600 transition-colors" href={url}>
								{url}
							</a>
						</div>
						<div>
							<p className="text-sm">{descriptionText}</p>
						</div>
						<div className="text-xs">
							<span
								className={`block ${safeBrowsingResult.match ? 'text-red-500' : 'text-green-600'}`}
							>
								{safeBrowsingResult.match ? '❌ This site is unsafe' : '✅ No unsafe content found'}
							</span>
							<span className="block text-gray-600">Checked at {time}</span>
						</div>
						<div>
							<Button text="Continue" handler={handleClick} />
						</div>
					</div>
				</Modal>
			) : (
				''
			)}
		</>
	)
}
