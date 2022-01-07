import { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '../../util/mongodb'
import { nanoid } from 'nanoid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        const { db } = await connectToDatabase()

        let full
        let short = nanoid(8)

        let clientIp = req.headers['x-real-ip'] ? req.headers['x-real-ip'] : null
        // The following only works if the app is deployed on Vercel
        let clientCountry = req.headers['x-vercel-ip-country'] ? req.headers['x-vercel-ip-country'] : null
        let clientRegion = req.headers['x-vercel-ip-country-region'] ? req.headers['x-vercel-ip-country-region'] : null
        let clientCity = req.headers['x-vercel-ip-city'] ? req.headers['x-vercel-ip-city'] : null
    
        let protocolRegExp:RegExp = new RegExp(/^(http|https):\/\//)

        if (!protocolRegExp.test(req.body)) {
            try {
                new URL('https://' + req.body)
                full = 'https://' + req.body
            } catch (_) {
                full = 'http://' + req.body
            }
        } else {
            full = req.body
        }
        
        try {
            await db.collection('links').insertOne({
                full,
                short,
                count: 0,
                clicks: [],
                clientIp,
                clientCountry,
                clientRegion,
                clientCity
            })
            return res.status(200).json({ shortUrl: req.headers.referer + short })
        } catch (_) {
            return res.status(500).json({ message: 'Internal Server Error' })
        }
    } else {
        return res.status(405).json({ message: 'Method Not Allowed' })
    }
}
