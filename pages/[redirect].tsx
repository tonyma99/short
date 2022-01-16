import { useEffect } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'

export default function Redirect(props: { host: string, protocol: string, ip: string, redirect: string }): null {
    const router = useRouter()

    useEffect(() => {
        const redirect = async () => {
            const response = await fetch(props.protocol + '://' + props.host + '/api/expand/' + props.redirect + (props.ip ? ('?ip=' + props.ip) : ''))
        
            if (response.status === 200) {
                const url = (await response.json()).url
                router.push(url)
            } else {
                router.push('/')
            }
        }
        redirect()
    }, [props, router])

    return null
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const host = context.req.headers.host
    const protocol = context.req.headers['x-forwarded-proto'] || context.req.headers.referer?.split('://')[0] || 'http'
    const ip = context.req.headers['x-real-ip']
    const redirect = context.query.redirect

    return {
        props: { 
            host: (host ? host : null),
            protocol,
            ip: (ip ? ip : null),
            redirect
        }
    }
}
