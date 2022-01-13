import '../styles/globals.css'
import { AppProps } from 'next/app'
import Head from 'next/head'
import { SessionProvider } from 'next-auth/react'
import { useState, useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark')
    const [load, setLoad] = useState(false)

    const toggleTheme = () => {
        if (mode === 'light') {
            let savedState = JSON.parse(localStorage.getItem('state'))
            savedState.theme = 'dark'
            localStorage.setItem('state', JSON.stringify(savedState))
            setMode('dark')
        } else {
            let savedState = JSON.parse(localStorage.getItem('state'))
            savedState.theme = 'light'
            localStorage.setItem('state', JSON.stringify(savedState))
            setMode('light')
        }
    }

    const globalTheme = createTheme({ palette: { mode } })

    const theme = useMemo(
        () =>
            createTheme({
                typography: { 
                    button: {
                        fontWeight: 'bold',
                        textTransform: 'none'
                    },
                    fontFamily: '"Open Sans", "Roboto", "Helvetica", "Arial", sans-serif'
                },
                components: {
                    MuiAlert: { styleOverrides: {
                        root: {
                            fontWeight: 'bold',
                            paddingTop: '8px',
                            paddingBottom: '8px'
                        }
                    }},
                    MuiButton: { styleOverrides: {
                        root: {
                            '&:hover': { backgroundColor: globalTheme.palette.primary.dark },
                            '&, &:hover, &:active': { boxShadow: 'none'},
                            backgroundColor: globalTheme.palette.primary.main,
                            color: 'globalTheme.palette.primary.contrastText',
                        }
                    }},
                    MuiButtonBase: { defaultProps: { disableRipple: true } },
                    MuiIconButton: { styleOverrides: {
                        root: {
                            borderColor: mode === 'dark' ? '#515151' : '#e0e0e0',
                            borderRadius: 12,
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            padding: '8px',
                        }
                    }},
                    MuiInputLabel: { styleOverrides: {
                        root: {
                            fontWeight: 'bold',
                            userSelect: 'none'
                        }
                    }},
                    MuiTextField: { styleOverrides: {
                        root: {
                            '& input, & select': {
                                fontWeight: 'bold'
                            },
                        }
                    }},
                    MuiSnackbar: { styleOverrides: {
                        root: {
                            bottom: '16px',
                            left: '16px',
                            right: '16px'
                        }
                    }},
                    MuiSvgIcon: { defaultProps: { fontSize: 'small' }},
                    MuiTableContainer: { styleOverrides: {
                        root: {
                            borderColor: mode === 'dark' ? '#515151' : '#e0e0e0',
                            borderRadius: 12,
                            borderStyle: 'solid',
                            borderWidth: 1
                        }
                    }},
                    MuiToggleButton: { styleOverrides: {
                        root: {
                            color: globalTheme.palette.text.secondary
                        }
                    }}
                },
                palette: { mode },
                shape: { borderRadius: 12 }
            }),
        [globalTheme, mode]
    )

    useEffect(() => {
        const savedState = localStorage.getItem('state')
        if (savedState) {
            setMode(JSON.parse(savedState).theme)
        } else {
            localStorage.setItem('state', JSON.stringify(
                {
                    data: [],
                    length: 8,
                    prepend: false,
                    theme: 'dark',
                    user: null
                }
            ))
        }
        setLoad(true)
    }, [])

    return (
        <SessionProvider session={session}>
            <Head>
                <title>Short</title>
                <meta name="description" content="URL shortener" />
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width" />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📎</text></svg>" />
            </Head>
            
            <ThemeProvider theme={theme}>
                <CssBaseline />
                { load ? <Component {...pageProps} toggleTheme={toggleTheme} theme={mode} /> : null }           
            </ThemeProvider>
        </SessionProvider>
    )
}
