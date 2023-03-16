import './globals.css'
import { AnalyticsWrapper } from '@components'
import { Inter } from 'next/font/google'
import { AuthContext } from '@components'

export const metadata = {
	title: 'Short',
	description: 'A simple URL shortener.'
}

const inter = Inter({
	variable: '--font-inter',
	display: 'swap',
	subsets: ['latin']
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" className={`${inter.variable} bg-gray-50`}>
			<AuthContext>
				<body>{children}</body>
			</AuthContext>
			<AnalyticsWrapper />
		</html>
	)
}
