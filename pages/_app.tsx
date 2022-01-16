import '../styles/globals.css'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useState, useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark')

    const toggleTheme = () => {
        if (mode === 'light') {
            let savedState = JSON.parse(sessionStorage.getItem('state'))
            savedState.theme = 'dark'
            sessionStorage.setItem('state', JSON.stringify(savedState))
            setMode('dark')
        } else {
            let savedState = JSON.parse(sessionStorage.getItem('state'))
            savedState.theme = 'light'
            sessionStorage.setItem('state', JSON.stringify(savedState))
            setMode('light')
        }
    }

    const globalTheme = createTheme({ palette: { mode } })

    const theme = useMemo(
        () =>
            createTheme({
                typography: { 
                    button: { fontWeight: 'bold', textTransform: 'none' },
                    fontFamily: 'Open Sans, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'
                },
                components: {
                    MuiButton: { styleOverrides: { root: { '&:hover': { backgroundColor: globalTheme.palette.primary.dark }, '&, &:hover, &:active': { boxShadow: 'none'}, backgroundColor: globalTheme.palette.primary.main, color: 'globalTheme.palette.primary.contrastText' } } },
                    MuiButtonBase: { defaultProps: { disableRipple: true } },
                    MuiIconButton: { styleOverrides: { root: { borderColor: globalTheme.palette.divider, borderRadius: 12, borderStyle: 'solid', borderWidth: '1px', padding: '8px' } } },
                    MuiInputLabel: { styleOverrides: { root: { fontWeight: 500, userSelect: 'none' } } },
                    MuiTextField: { styleOverrides: { root: { '& input, & select': { fontWeight: 500 } } } },
                    MuiSvgIcon: { defaultProps: { fontSize: 'small' }},
                    MuiTableCell: { styleOverrides: { root: { borderBottomColor: globalTheme.palette.divider } } },
                    MuiTableContainer: { styleOverrides: { root: { borderColor: globalTheme.palette.divider, borderRadius: 12, borderStyle: 'solid', borderWidth: 1 } } },
                    MuiToggleButton: { styleOverrides: { root: { color: globalTheme.palette.text.secondary } } }
                },
                palette: { mode },
                shape: { borderRadius: 12 }
            }),
        [globalTheme, mode]
    )

    useEffect(() => {
        const loadTheme = () => {
            if (sessionStorage.state) {
                const savedTheme = JSON.parse(sessionStorage.state).theme
                if (mode !== savedTheme) setMode(savedTheme)
            }
        }
        loadTheme()
    }, [mode])

    return (
        <SessionProvider session={session}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Component {...pageProps} toggleTheme={toggleTheme} theme={mode} />
            </ThemeProvider>
        </SessionProvider>
    )
}
