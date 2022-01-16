import { useEffect, useState } from 'react'
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Redirect(props: { host: string, protocol: string, ip: string, redirect: string }) {
    const [load, setLoad] = useState(false)
    const [url, setUrl] = useState('')
    const router = useRouter()

    useEffect(() => {
        const redirect = async () => {
            const response = await fetch(props.protocol + '://' + props.host + '/api/expand/' + props.redirect + (props.ip ? ('?ip=' + props.ip) : ''))
        
            if (response.status === 200) {
                const url = (await response.json()).url
                setUrl(url)
                setLoad(true)
                router.push(url)
            } else {
                router.push('/')
            }
        }
        redirect()
    }, [props, router])

    return (
        load &&
        <Box sx={{ alignItems: 'center', display: 'flex', height: '100%'}}>
            <Container sx={{ textAlign: 'center' }}>
                <Typography sx={{ fontWeight: 'bold' }}>
                    Redirecting to {url}...
                </Typography>
            </Container>
        </Box>
    )
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
