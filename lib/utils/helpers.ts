export class Client {
  country: string
  region: string
  city: string
  constructor(headers: any) {
    this.country = headers['x-vercel-ip-country']
    this.region = headers['x-vercel-ip-country-region']
    this.city = headers['x-vercel-ip-city']
  }
  get() {
    return {
      country: this.country,
      region: this.region,
      city: this.city,
    }
  }
}

export const lookupSafeBrowsing = async (url: string) => {
  const api = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_SAFE_BROWSING_API}`
  const res = await fetch(api, {
    method: 'POST',
    headers: { 'Content-type': 'application/json' },
    body: JSON.stringify({
      client: {
        clientId: 'tonyma99/short',
        clientVersion: '1.0.0',
      },
      threatInfo: {
        threatTypes: [
          'THREAT_TYPE_UNSPECIFIED',
          'MALWARE',
          'SOCIAL_ENGINEERING',
          'UNWANTED_SOFTWARE',
          'POTENTIALLY_HARMFUL_APPLICATION',
        ],
        platformTypes: ['ANY_PLATFORM'],
        threatEntryTypes: ['URL'],
        threatEntries: [{ url: url }],
      },
    }),
  })
  const { matches } = await res.json()
  if (matches) {
    return false
  } else {
    return true
  }
}
