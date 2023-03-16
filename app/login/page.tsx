import { GitHubLoginButton } from '@components'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'

export default async function Login() {
	const session = await getServerSession(authOptions)

	if (session) throw redirect('/')

	return (
		<div className="flex h-screen w-screen justify-center items-center">
			<GitHubLoginButton />
		</div>
	)
}
