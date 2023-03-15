'use client'
import { Button, Modal } from '@components'
import { useRouter } from 'next/navigation'

export default function RedirectModal({ url }: { url: string }) {
	const descriptionText =
		'This redirect may potentially be harmful. Continue only if you trust the source to avoid malware, viruses, or phishing scams. This warning appears when the link is created by an unauthenticated user.'

	const router = useRouter()

	const handleClick = () => {
		router.push(url)
	}

	return (
		<Modal>
			<div className="flex flex-col gap-4 text-center text-sm">
				<div>
					<h3 className="font-bold text-base">You are being redirected to</h3>
					<a className="text-blue-500 hover:text-blue-600 transition-all" href={url}>
						{url}
					</a>
				</div>
				<div className="px-4">
					<p className="text-sm">{descriptionText}</p>
				</div>
				<div>
					<Button text="Continue" handler={handleClick} />
				</div>
			</div>
		</Modal>
	)
}
