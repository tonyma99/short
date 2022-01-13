import { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import { nanoid } from 'nanoid'
import clientPromise from '../../lib/mongodb'

async function checkDomain(url: string) {
    const urlRegExp = new RegExp(/(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    try {
        if (urlRegExp.test(url) && (await fetch(url, { method: 'HEAD' })).status === 200) {
            return url
        } else if ((await fetch('https://' + url, { method: 'HEAD' })).status === 200) {
            return 'https://' + url
        } else if ((await fetch('http://' + url, { method: 'HEAD' })).status === 200) {
            return 'http://' + url
        }
    } catch (_) {}

    return ''
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const fullUrl = await checkDomain(req.body.url)
        if (!fullUrl) {
            return res.status(400).end()
        }

        try {
            const session = await getSession({ req })

            const links = (await clientPromise).db(process.env.MONGODB_DB).collection(process.env.MONGODB_LINKS)

            const length = req.body.length && req.body.length <= 20 ? req.body.length : 8
            const shortUrl = session && req.body.prepend ? session.user.username + '-' + nanoid(length) : nanoid(length)

            links.insertOne({
                fullUrl,
                shortUrl,
                count: 0,
                visits: [],
                created: new Date(),
                user: session ? session.user.username : null,
                userIp: req.headers['x-real-ip'] ? req.headers['x-real-ip'] : null,
                userCountry: req.headers['x-vercel-ip-country'] ? req.headers['x-vercel-ip-country'] : null,
                userRegion: req.headers['x-vercel-ip-country-region'] ? req.headers['x-vercel-ip-country-region'] : null,
                userCity: req.headers['x-vercel-ip-city'] ? req.headers['x-vercel-ip-city'] : null
            })

            return res.status(200).json({ shortUrl: 'http://' + req.headers.host + '/' + shortUrl })
        } catch (_) {
            return res.status(500).end()
        }
    } else {
        return res.status(405).end()
    }
}
