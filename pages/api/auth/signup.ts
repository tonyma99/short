import { NextApiRequest, NextApiResponse } from 'next'
import clientPromise from '../../../lib/mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method == 'POST') {
        if (!(req.body.username && (new RegExp('^[a-zA-Z0-9]{4,16}$')).test(req.body.username)) ||
            !(req.body.password && (new RegExp('^.{8,64}$')).test(req.body.password))) {
            return res.status(400).end()
        }

        try {
            const users = (await clientPromise).db(process.env.MONGODB_DB).collection(process.env.MONGODB_USERS)
            const userLowerCase = req.body.username.toLowerCase()

            if (await users.findOne({ username: userLowerCase })) {
                return res.status(400).end()
            }
            
            const bcrypt = require('bcrypt')

            users.insertOne({
                username: userLowerCase,
                password: await bcrypt.hash(req.body.password, 10),
                created: new Date(),
                lastLogin: null,
                ip: req.headers['x-real-ip'] ? req.headers['x-real-ip'] : null,
            })

            return res.status(200).end()
        } catch (error) {
            return res.status(500).end()
        }
    } else {
        return res.status(405).end()
    }
}
