import './globals.css'
import { AnalyticsWrapper } from '@lib/components'

export const metadata = {
	title: 'Short',
	description: 'A simple URL shortener.'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body>{children}</body>
			<AnalyticsWrapper />
		</html>
	)
}
