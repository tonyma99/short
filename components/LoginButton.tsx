'use client'
import { Button } from '@components'
import { useRouter } from 'next/navigation'

export default function LoginButton() {
	const router = useRouter()

	return <Button className="text-sm" text="Login" handler={() => router.push('/login')} />
}
