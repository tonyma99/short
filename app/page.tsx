import { CreateLinkForm, Layout } from '@components'

export default async function Home() {
	return (
		/* @ts-expect-error Async Server Component */
		<Layout>
			<div className="flex flex-col gap-8 items-center justify-center w-screen container mx-auto px-4">
				<span className="text-6xl">🔗 </span>
				<CreateLinkForm />
			</div>
		</Layout>
	)
}
