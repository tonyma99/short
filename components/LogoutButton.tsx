'use client'
import { Button } from '@components'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
	return <Button className="text-sm" text="Logout" handler={signOut} />
}
