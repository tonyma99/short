import '../styles/globals.css'
import { AppProps } from 'next/app'
import { useState, useMemo } from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

export default function App({ Component, pageProps }: AppProps) {
    const [mode, setMode] = useState<'light' | 'dark'>('dark');
    const toggleTheme = () => {
        setMode(mode == 'light' ? 'dark' : 'light')
    }

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
