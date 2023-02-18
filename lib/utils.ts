import { IncomingHttpHeaders } from 'http'

export class Client {
  country
  region
  city
  constructor(headers: IncomingHttpHeaders) {
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
