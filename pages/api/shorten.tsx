import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../util/mongodb'
import { nanoid } from 'nanoid'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await connectToDatabase();

    let fullUrl;
    let shortUrl = nanoid(10)

    try {
        new URL('https://' + req.body)
        fullUrl = 'https://' + req.body
    } catch (_) {
        fullUrl = 'http://' + req.body
    }
    
    await db.collection('links').insertOne({
        fullUrl: fullUrl,
        shortUrl: shortUrl
    })

    return res.json({
        message: shortUrl,
        success: true
    });
}
