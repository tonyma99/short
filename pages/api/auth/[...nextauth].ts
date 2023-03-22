import NextAuth from 'next-auth'
import GithubProvider from 'next-auth/providers/github'
import { Users } from '@lib/db'

export const authOptions = {
	providers: [
		GithubProvider({
			clientId: process.env.GITHUB_ID,
			clientSecret: process.env.GITHUB_SECRET
		})
	],
	pages: {
		signIn: '/login'
	},
	callbacks: {
		async signIn({ user, account }: any) {
			const _user = await Users.get(user.email)

			if (_user) {
				await Users.update(user.email)
			} else {
				await Users.create({
					email: user.email,
					name: user.name,
					oauth: account.provider
				})
			}

			return true
		}
	}
}

export default NextAuth(authOptions)
