import { Header, Footer } from '@components'
import { PropsWithChildren } from 'react'
import { getServerSession } from 'next-auth/next'

export default async function Layout({ children }: PropsWithChildren) {
	const session = await getServerSession()

	return (
		<div className="flex flex-col min-h-screen">
			<Header authenticated={session ? true : false} />
			<main className="flex flex-grow">{children}</main>
			<Footer />
		</div>
	)
}
