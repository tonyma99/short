import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '../../util/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const shortid = require('shortid').generate()
    const { db } = await connectToDatabase();

    let fullUrl;

    try {
        new URL('https://' + req.body)
        fullUrl = 'https://' + req.body
    } catch (_) {
        fullUrl = 'http://' + req.body
    }
    
    await db.collection('links').insertOne({
        fullUrl: fullUrl,
        shortUrl: shortid
    })

    return res.json({
        message: shortid,
        success: true
    });
}
