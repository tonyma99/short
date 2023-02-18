interface Link {
  id: string
  target: string
  created: Date
  user?: string
  clicks?: Array<Click>
  client?: ClientDetail
}

interface Click {
  date: Date
  client?: ClientDetail
}

interface ClientDetail {
  country: string | string[] | undefined
  region: string | string[] | undefined
  city: string | string[] | undefined
}
