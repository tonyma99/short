import Head from 'next/head'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Footer from '../components/Footer'
import Form from '../components/Form'
import Header from '../components/Header'
import Brightness4 from '@mui/icons-material/Brightness4'
import { MouseEventHandler } from 'react'

export default function Home(props: { toggleTheme:MouseEventHandler<HTMLAnchorElement> }) {
    return (
        <>
            <Head>
                <title>Short</title>
                <meta name="description" content="URL shortener" />
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width" />
                <link rel="icon" href="/favicon.ico" />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📎</text></svg>"></link>
            </Head>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
                <Header />
                
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Container maxWidth="md" sx={{ textAlign: 'center' }}>
                        <Typography variant="h1" component="h1" sx={{ fontWeight: 'bold', py: 0 }}>
                            Short
                        </Typography>

                        <IconButton onClick={props.toggleTheme as any} sx={{ mt: 1, mb: 3 }}>
                            <Brightness4 />
                        </IconButton>

                        <Form />
                    </Container>                    
                </Box>

                <Footer />
            </Box>
        </>
    )
}
