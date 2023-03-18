'use client'
import { Button } from '@components'
import { signIn } from 'next-auth/react'

export default function LoginButton() {
	return <Button className="text-sm" text="Login" handler={signIn} />
}
