'use client'
import { Button } from '@components'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

type Props = {
	authenticated: boolean
}

export default function Navbar({ authenticated }: Props) {
	const router = useRouter()

	return (
		<div className="flex justify-between w-full p-2">
			<Link href="/" className="text-3xl">
				🔗
			</Link>
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
		</div>
	)
}
