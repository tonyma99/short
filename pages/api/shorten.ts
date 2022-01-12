import { NextApiRequest, NextApiResponse } from 'next'
import { nanoid } from 'nanoid'
import clientPromise from '../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        if (!req.body.url || (req.body.user && (!req.body.user.match('^[a-zA-Z0-9]*$') || req.body.user.length < 4 || req.body.user.length > 16))) {
            return res.status(406).json({
                error: {
                    code: 406,
                    message: 'Not Acceptable'
                }
            })
        }

        try {
            const client = await clientPromise
            const db = client.db(process.env.MONGODB_DB)

            const length = req.body.length && req.body.length <= 20 ? req.body.length : 8
            const shortUrl = req.body.user && req.body.prepend ? req.body.user + '-' + nanoid(length) : nanoid(length)
            
            let fullUrl

            const protocol:RegExp = new RegExp(/^(http|https):\/\//)

            if (!protocol.test(req.body.url)) {
                try {
                    new URL('https://' + req.body.url)
                    fullUrl = 'https://' + req.body.url
                } catch (_) {
                    fullUrl = 'http://' + req.body.url
                }
            } else {
                fullUrl = req.body.url
            }

            const userIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : null
            // The following only works if the app is deployed on Vercel
            const userCountry = req.headers['x-vercel-ip-country'] ? req.headers['x-vercel-ip-country'] : null
            const userRegion = req.headers['x-vercel-ip-country-region'] ? req.headers['x-vercel-ip-country-region'] : null
            const userCity = req.headers['x-vercel-ip-city'] ? req.headers['x-vercel-ip-city'] : null
            
            db.collection(process.env.MONGODB_COLLECTION).insertOne({
                fullUrl,
                shortUrl,
                count: 0,
                visits: [],
                timestamp: new Date(),
                user: req.body.user,
                userIp,
                userCountry,
                userRegion,
                userCity
            })

            return res.status(200).json({ shortUrl: 'http://' + req.headers.host + '/' + shortUrl })
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
                error: 405,
                message: 'Method Not Allowed'
            }
        })
    }
}
