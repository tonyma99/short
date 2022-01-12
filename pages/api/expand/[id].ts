import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'GET') {
        try {
            const client = await clientPromise
            const db = client.db(process.env.MONGODB_DB)
            const result = await db.collection(process.env.MONGODB_COLLECTION).findOne({ shortUrl: req.query.id })
            
            if (result) {
                const ip = req.query.ip ? req.query.ip : req.headers['x-real-ip']
                await db.collection(process.env.MONGODB_COLLECTION).updateOne(
                    { shortUrl: req.query.id },
                    { $inc: { count: 1 }, $push: { visits: ip ? ip : null } }
                )

                return res.status(200).json({ url: result.fullUrl })
            } else {
                return res.status(404).json({
                    error: 404,
                    message: 'Not Found'
                })
            }
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
