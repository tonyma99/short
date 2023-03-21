import './globals.css'
import { AnalyticsWrapper, AuthContext, Footer, Navbar } from '@components'
import { Inter } from 'next/font/google'
import { getServerSession } from 'next-auth'

export const metadata = {
	title: 'Short',
	description: 'A simple URL shortener.'
}

const inter = Inter({
	variable: '--font-inter',
	display: 'swap',
	subsets: ['latin']
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
	const session = await getServerSession()

	return (
		<html lang="en" className={`${inter.variable} bg-gray-50`}>
			<AuthContext>
				<body className="flex flex-col min-h-screen">
					<nav>
						<Navbar authenticated={session ? true : false} />
					</nav>
					<main className="flex-grow">{children}</main>
					<footer>
						<Footer />
					</footer>
				</body>
			</AuthContext>
			<AnalyticsWrapper />
		</html>
	)
}
