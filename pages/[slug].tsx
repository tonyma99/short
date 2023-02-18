import { GetServerSideProps } from 'next'

export default function Redirect() {}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  query,
}) => {
  const host = req.headers.host
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
  const id = query.slug
  const result = await fetch(`${protocol}://${host}/api/expand?id=${id}`)
  const { url } = await result.json()

  return {
    redirect: {
      permanent: false,
      destination: url ? url : '/',
    },
  }
}
