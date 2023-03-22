import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import clientPromise from '@lib/mongodb'

export default async function AccountPage() {
	const session = await getServerSession()

	if (!session) {
		throw redirect('/login')
	}

	const db = (await clientPromise).db()
	const users = db.collection('users')
	const user = await users.findOne({ email: session.user?.email })

	if (!user?.admin) throw redirect('/')

	return (
		<div className="flex flex-col flex-grow items-center text-center text-4xl mt-[33vh]">🚨</div>
	)
}
