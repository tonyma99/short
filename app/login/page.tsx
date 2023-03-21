import { GitHubLoginButton, Layout } from '@components'
import { getServerSession } from 'next-auth/next'
import { redirect } from 'next/navigation'

export default async function Login() {
	const session = await getServerSession()

	if (session) throw redirect('/')

	return (
		/* @ts-expect-error Async Server Component */
		<Layout>
			<div className="flex flex-col w-screen mt-[33vh] items-center">
				<GitHubLoginButton />
			</div>
		</Layout>
	)
}
