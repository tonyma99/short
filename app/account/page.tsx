import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'
import clientPromise from '@lib/mongodb'
import { headers } from 'next/headers'
import { Layout } from '@components'

export default async function AccountPage() {
	const session = await getServerSession()

	if (!session) {
		throw redirect('/login')
	}

	const headerList = headers()
	const protocol = headerList.get('x-forwarded-proto') || 'http'
	const hostname = headerList.get('x-forwarded-host') || 'localhost:3000'

	const db = (await clientPromise).db()
	const collection = db.collection('links')
	const links = await collection.find({ user: session.user?.email }).toArray()

	return (
		/* @ts-expect-error Async Server Component */
		<Layout>
			<div className="flex flex-col flex-grow items-center text-center text-4xl mt-[33vh]">🚧</div>
		</Layout>
	)
}
