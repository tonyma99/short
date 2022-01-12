import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise
            const db = client.db(process.env.MONGODB_DB)
            const result = db.collection(process.env.MONGODB_COLLECTION).find({ user: req.query.id })
        
            const data: { fullUrl: string, shortUrl: string, date: string, count: number }[] = []

            const protocol = req.headers['x-forwarded-proto'] || req.headers.referer?.split('://')[0]

            await result.forEach((document) => {
                data.push({
                    fullUrl: document.fullUrl,
                    shortUrl: protocol + '://' + req.headers.host + '/' + document.shortUrl,
                    date: `${document.timestamp.getDate()}/${document.timestamp.getMonth() + 1}/${document.timestamp.getFullYear()}`,
                    count: document.count
                })
            })
            return res.status(200).json({ data })
        } catch (_) {
            return res.status(500).json({
                error: {
                    status: 500,
                    message: 'Internal Server Error'
                }
            })
        }
    } else {
        return res.status(405).json({
            error: {
                status: 405,
                message: 'Method Not Allowed'
            }
        })
    }
}
