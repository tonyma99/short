import type { NextApiRequest, NextApiResponse } from 'next'
import { getLink, updateLink } from '@lib/mongodb'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: `${req.method} method not allowed.` })
    return
  }
  try {
    const { id }: any = req.query
    try {
      const url = await getLink(id)
      updateLink(id)
      res.status(200).json({ url })
    } catch {
      res.status(400).json({ message: 'The specified code is invalid.' })
    }
  } catch {
    res.status(500).json({ message: 'Internal server error.' })
  }
}
