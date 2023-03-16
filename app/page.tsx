import { CreateLinkForm, GitHubLoginButton, LogoutButton } from '@components'
import { getServerSession } from 'next-auth/next'
import { authOptions } from 'pages/api/auth/[...nextauth]'

export default async function Home() {
	const session = await getServerSession(authOptions)

	return (
		<div className="flex flex-col gap-8 items-center justify-center h-screen w-screen container mx-auto px-4">
			<span className="text-6xl">🔗 </span>
			<CreateLinkForm />
			<div className="absolute right-4 top-4">
				{!session ? (
					<GitHubLoginButton />
				) : (
					<div className="">
						<pre className="text-sm mr-2 inline-block">
							{session.user?.name}&lt;{session.user?.email}&gt;
						</pre>
						<LogoutButton />
					</div>
				)}
			</div>
		</div>
	)
}
