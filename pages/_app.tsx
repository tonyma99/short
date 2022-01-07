import '../styles/globals.css'
import { AppProps } from 'next/app'
import { useState, useMemo, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function App({ Component, pageProps }: AppProps) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark');

    const toggleTheme = () => {
        if (mode == 'light') {
            localStorage.setItem("theme", "dark")
            setMode("dark")
        } else {
            localStorage.setItem("theme", "light")
            setMode("light")
        }
    }

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme')
        if (savedTheme && savedTheme == 'dark' || savedTheme == 'light') {
            setMode(savedTheme)
        }
    })

    const theme = useMemo(
        () =>
            createTheme({
                palette: {
                    mode,
                },
            }),
        [mode],
    );

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Component {...pageProps} toggleTheme={toggleTheme}/>
        </ThemeProvider>
    )
}
