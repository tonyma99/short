import { CreateLinkForm } from '@components'

export default function Home() {
	return (
		<div className="flex flex-col gap-8 items-center justify-center h-screen w-screen container mx-auto px-4">
			<span className="text-6xl">🔗 </span>
			<CreateLinkForm />
		</div>
	)
}
