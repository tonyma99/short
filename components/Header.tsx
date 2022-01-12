import * as React from 'react'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'

export default function Header(props: { toggleDrawer: React.MouseEventHandler<HTMLAnchorElement>, toggleTheme: React.MouseEventHandler<HTMLAnchorElement>, theme: string }) {
    const changeTheme = (event: any) => {
        props.toggleTheme(event)
    }

    return (
        <Box sx={{ display: 'flex', borderBottomColor: 'divider', borderBottomStyle: 'solid', borderBottomWidth: 1, py: '10px' }}> 
            <Container maxWidth='md' sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Typography variant='h6' component='div'>
                <Link href='/' underline='none' sx={{ fontWeight: 'bold', userSelect: 'none' }}>
                    Short
                </Link>
                </Typography>
                <IconButton onClick={changeTheme} sx={{ ml: 'auto' }}>
                    {props.theme == 'dark' ? <LightModeRoundedIcon /> : <DarkModeRoundedIcon />}
                </IconButton>
                <IconButton onClick={props.toggleDrawer as any} sx={{ ml: 1 }}>
                    <SettingsRoundedIcon />
                </IconButton>
            </Container>
        </Box>
    )
}
