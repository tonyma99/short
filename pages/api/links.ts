import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const session = await getSession({ req })

            const links = (await clientPromise).db(process.env.MONGODB_DB).collection(process.env.MONGODB_LINKS)
            const result = links.find({ user: session.user.username })
        
            const data: { fullUrl: string, shortUrl: string, created: string, count: number }[] = []

            const protocol = req.headers['x-forwarded-proto'] || req.headers.referer?.split('://')[0]

            await result.forEach((document) => {
                data.push({
                    fullUrl: document.fullUrl,
                    shortUrl: protocol + '://' + req.headers.host + '/' + document.shortUrl,
                    created: `${document.created.getDate()}/${document.created.getMonth() + 1}/${document.created.getFullYear()}`,
                    count: document.count
                })
            })
            return res.status(200).json({ data })
        } catch (_) {
            return res.status(500).end()
        }
    } else {
        return res.status(405).end()
    }
}
