'use client'
import { Button, Modal } from '@components'
import { signIn } from 'next-auth/react'
import Image from 'next/image'

export default function LoginModal() {
	return (
		<Modal className="!bg-transparent">
			<Button
				className="!bg-black hover:!bg-gray-800 text-sm text-white"
				text="Login with GitHub"
				icon={<Image src="/github.svg" alt="GitHub logo" width={16} height={16} />}
				handler={() => signIn('github')}
			/>
		</Modal>
	)
}
