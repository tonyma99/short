import type { NextApiRequest, NextApiResponse } from 'next'
import { createLink } from '@lib/utils/mongodb'
import {
  completeUrl,
  lookupSafeBrowsing,
  validateUrl,
} from '@lib/utils/helpers'

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
    const url = completeUrl(target)
    console.log('Validate URL', validateUrl(url))
    console.log('Safe Browsing', await lookupSafeBrowsing(url))
    if (!validateUrl(url) || !(await lookupSafeBrowsing(url))) {
      res.status(400).json({ message: 'The specified URL is not allowed.' })
      return
    }
    const { id } = await createLink(url, headers)
    res.status(200).json({
      url: `${process.env.NODE_ENV === 'production' ? 'https' : 'http'}://${
        headers.host
      }/${id}`,
    })
  } catch {
    res.status(500).json({ message: 'Internal server error.' })
  }
}
