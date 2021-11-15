import { connectToDatabase } from '../../util/mongodb'

export default async function handler(req, res) {
    let valid = true
    try {
        const test = await fetch(req.body, { method: 'HEAD' });
        if (test.status !== 200) {
            valid = false
        }
    } catch (error) {
        valid = false
    }
    
    if (!valid) {
        return res.json({
            message: 'Invalid URL',
            success: false
        })
    }

    const shortid = require('shortid').generate()
    const { db } = await connectToDatabase();
    
    await db.collection('links').insertOne({
        fullURL: req.body,
        shortURL: shortid
    })

    return res.json({
        message: shortid,
        success: true
    });
}
