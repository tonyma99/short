interface Link {
  id: string
  target: string
  created: Date
  clicks?: Array<Click>
  client?: ClientDetail
}

interface Click {
  date: Date
}

interface ClientDetails {
  country: string
  region: string
  city: string
}
