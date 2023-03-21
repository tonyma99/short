import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function AccountPage() {
	const session = await getServerSession()

	if (!session) {
		throw redirect('/login')
	}

	return (
		<div className="flex flex-col flex-grow items-center text-center text-4xl mt-[33vh]">🚧</div>
	)
}
