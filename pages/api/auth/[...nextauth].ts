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
		async signIn({ user: _user }: any) {
			const user = await Users.get(_user.email)

			if (user) {
				await Users.update(_user.email)
			} else {
				await Users.create(_user.email)
			}

			return true
		}
	}
}

export default NextAuth(authOptions)
