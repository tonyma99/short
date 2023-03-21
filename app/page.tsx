import { CreateLinkForm } from '@components'

export default async function Home() {
	return (
		<div className="flex flex-col gap-8 items-center w-screen container mx-auto px-4">
			<span className="text-6xl mt-[33vh]">🔗 </span>
			<CreateLinkForm />
		</div>
	)
}
