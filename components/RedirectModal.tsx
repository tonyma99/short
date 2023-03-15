'use client'
import { Button, Modal } from '@components'
import { useRouter } from 'next/navigation'

const descriptionText =
	'This redirect may potentially be harmful. Continue only if you trust the source to avoid malware, viruses, or phishing scams. This warning appears when the link is created by an unauthenticated user.'

export default function RedirectModal({ url }: { url: string }) {
	const router = useRouter()

	const handleClick = () => {
		router.push(url)
	}

	return (
		<Modal>
			<div className="flex flex-col gap-4 text-center">
				<div>
					<h3 className="font-bold text-lg">You are being redirected to</h3>
					<a className="text-blue-500 hover:text-blue-600 transition-all" href={url}>
						{url}
					</a>
				</div>
				<div className="px-4">
					<span className="text-sm">{descriptionText}</span>
				</div>
				<Button text="Continue" handler={handleClick} />
			</div>
		</Modal>
	)
}
