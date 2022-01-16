import { MouseEventHandler } from 'react'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function Header(props: {
    toggleMenu: MouseEventHandler<HTMLAnchorElement>,
    handleChangeTheme: (event: any, newOption: string) => void,
    theme: string
}) {
    const toggleTheme = (event: any) => {
        props.handleChangeTheme(event, props.theme === 'dark' ? 'light' : 'dark')
    }

    return (
        <Box sx={{ display: 'flex', borderBottomColor: 'divider', borderBottomStyle: 'solid', borderBottomWidth: 1, py: 1 }}> 
            <Container maxWidth='md' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Typography variant='h6' component='div'>
                <Link href='/' underline='none' sx={{ fontWeight: 'bold', userSelect: 'none' }}>
                    Short
                </Link>
                </Typography>
                <IconButton onClick={toggleTheme} sx={{ ml: 'auto' }}>
                    {props.theme == 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                </IconButton>
                <IconButton onClick={props.toggleMenu as any} sx={{ ml: 1 }}>
                    <SettingsRoundedIcon />
                </IconButton>
            </Container>
        </Box>
    )
}
