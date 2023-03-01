export class ClientDetails {
	country: string
	region: string
	city: string

	constructor(headers: Headers) {
		this.country = headers.get('x-vercel-ip-country') as string
		this.region = headers.get('x-vercel-ip-country-region') as string
		this.city = headers.get('x-vercel-ip-city') as string
	}

	get() {
		return {
			country: this.country,
			region: this.region,
			city: this.city
		}
	}
}

export const safeBrowsingLookup = async (url: string) => {
	const api = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_API_KEY}`
	const res = await fetch(api, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			client: {
				clientId: 'tonyma99/short',
				clientVersion: '0.0.1'
			},
			threatInfo: {
				threatTypes: [
					'THREAT_TYPE_UNSPECIFIED',
					'MALWARE',
					'SOCIAL_ENGINEERING',
					'UNWANTED_SOFTWARE',
					'POTENTIALLY_HARMFUL_APPLICATION'
				],
				platformTypes: ['ANY_PLATFORM'],
				threatEntryTypes: ['URL'],
				threatEntries: [{ url }]
			}
		})
	})

	const { matches } = await res.json()

	if (matches) {
		return false
	} else {
		return true
	}
}

export const completeUrl = (url: string) => {
	const pattern = new RegExp('^([a-zA-Z]+:\\/\\/)')
	if (!pattern.test(url)) {
		return 'http://' + url
	}
	return url
}

export const validateUrl = (url: string) => {
	const pattern = new RegExp(
		'^([a-zA-Z]+:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$',
		'i'
	)
	return pattern.test(url)
}
