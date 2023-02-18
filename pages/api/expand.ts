import type { NextApiRequest, NextApiResponse } from 'next'
import { getLink, updateLink } from '@lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: `${req.method} method not allowed.` })
  }
  try {
    const { headers } = req
    const { id } = req.query
    let url
    if (id) {
      try {
        url = await getLink(id)
        updateLink(id, headers)
      } catch {
        res.status(400).json({ message: 'The specified code is invalid.' })
      }
    }

    res.status(200).json({ url })
  } catch {
    res.status(500).json({ message: 'Internal server error.' })
  }
}
