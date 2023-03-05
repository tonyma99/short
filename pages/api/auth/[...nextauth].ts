import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import clientPromise from '../../../lib/mongodb'

export default NextAuth({
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                username: { label: 'Username', type: 'text' },
                password: { label: 'Password', type: 'password' }
            },
            authorize: async (credentials) => {
                try {
                    const users = (await clientPromise).db().collection('users')
                    const user = await users.findOne({ username: credentials.username.toLowerCase() })
                    if (user) {
                        const bcrypt = require('bcrypt')
                        const match = await bcrypt.compare(credentials.password, user.password)
                        if (match) {
                            users.updateOne({ username: credentials.username }, { $set: { lastLogin: new Date() } })
                            return { username: user.username }
                        }
                    }
                } catch (_) {}
                return null
            }
        })
    ],
    callbacks: {
        jwt: ({ token, user }) => {
            if (user) token.user = user
            return token
        },
        session: ({ session, token }) => {
            if (token) session.user = token.user
            return session
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: 'jwt'
    }
})
