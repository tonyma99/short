'use client'
import { Button } from '@components'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

type Props = {
	authenticated: boolean
}

export default function Header({ authenticated }: Props) {
	const router = useRouter()

	return (
		<header className="flex justify-between w-full p-2">
			<a href="/" className="text-3xl">
				🔗
			</a>
			<div className="space-x-2">
				{authenticated ? (
					<>
						<Button className="text-sm" text="Account" handler={() => router.push('/account')} />
						<Button className="text-sm" text="Logout" handler={signOut} />
					</>
				) : (
					<Button className="text-sm" text="Login" handler={() => router.push('/login')} />
				)}
			</div>
		</header>
	)
}
