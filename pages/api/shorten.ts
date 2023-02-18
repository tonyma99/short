import type { NextApiRequest, NextApiResponse } from 'next'
import { createLink } from '@lib/utils/mongodb'
import { lookupSafeBrowsing } from '@lib/utils/helpers'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: `${req.method} method not allowed.` })
    return
  }
  try {
    const { headers } = req
    const { target } = req.body
    if (!lookupSafeBrowsing(target)) {
      res.status(400).json({ message: 'The specified URL is not allowed.' })
      return
    }
    const link = await createLink(target, headers)
    const url = `${
      process.env.NODE_ENV === 'production' ? 'https' : 'http'
    }://${headers.host}/${link.id}`
    res.status(200).json({ url })
  } catch {
    res.status(500).json({ message: 'Internal server error.' })
  }
}
