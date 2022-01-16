import { Session } from 'next-auth'
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import DarkModeRoundedIcon from '@mui/icons-material/DarkModeRounded'
import GitHubIcon from '@mui/icons-material/GitHub'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import LightModeRoundedIcon from '@mui/icons-material/LightModeRounded'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded'
import { alpha } from '@mui/material'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

export default function Menu(props: {
    handleChangeLength: (newOption: number) => void,
    handleChangePrepend: (newOption: boolean) => void,
    handleChangeTheme: (event: any, newOption: string | null) => void,
    handleLogOut: () => void,
    handleShowLogIn: () => void,
    handleShowSignup: () => void,
    handleToggleMenu: () => void,
    length: number,
    menu: boolean,
    prepend: boolean,
    session: Session,
    theme: string
}) {
    return (
        <Drawer
            anchor='right'
            open={props.menu}
            onClose={props.handleToggleMenu}
            transitionDuration={250}
            elevation={0}
            sx={{
                '& .MuiDrawer-paper': { borderLeft: 1, borderLeftColor: 'divider', width: '360px' },
                '& .MuiToggleButton-root' : { flexGrow: 1, py: '12px' },
                '& .MuiToggleButtonGroup-root': { flexGrow: 1 }
            }}
        >
            <List sx={{ p: 0 }}>
                <ListItem sx={{ borderBottomColor: 'divider', borderBottomStyle: 'solid', borderBottomWidth: '1px', py: 1 }}>
                    <Typography fontWeight={700} variant='h6'>Settings</Typography>
                    <IconButton onClick={props.handleToggleMenu} sx={{ ml: 'auto' }}>
                        <CloseRoundedIcon/>
                    </IconButton>
                </ListItem>
            </List>
            <List sx={{ '& .MuiSvgIcon-root': { mr: 1 }, mb: 'auto' }}>
                {props.session ?
                <ListItem sx={{ }}>
                    <ToggleButton onChange={props.handleLogOut} value={0} className='IconToggleButton'
                        sx={{
                            '&:hover': { backgroundColor: (theme) => alpha(theme.palette.error.main, 0.2) },
                            backgroundColor: (theme) => alpha(theme.palette.error.main, 0.1),
                            borderColor: (theme) => alpha(theme.palette.error.main, 0.8),
                            color: 'text.primary'
                        }}
                    >
                        <LogoutRoundedIcon />
                        {props.session.user.username}
                    </ToggleButton>
                </ListItem>
                :
                <>
                <ListItem sx={{  }}>
                    <ToggleButton onChange={props.handleShowLogIn} value={0} className='IconToggleButton' sx={{ color: 'text.primary' }}>
                        <LoginRoundedIcon />
                        Log In
                    </ToggleButton>
                </ListItem>
                <ListItem sx={{  }}>
                    <ToggleButton onChange={props.handleShowSignup} value={0} className='IconToggleButton' sx={{ color: 'text.primary' }}>
                        <AssignmentIndRoundedIcon />
                        Sign Up
                    </ToggleButton>
                </ListItem>
                </>
                }
                    
                <ListItem sx={{ color: 'text.secondary', fontSize: 14, pb: 0 }}>
                    Theme
                </ListItem>
                <ListItem>
                    <ToggleButtonGroup value={props.theme} exclusive onChange={props.handleChangeTheme}>
                        <ToggleButton value='dark' className='IconToggleButton'>
                            <DarkModeRoundedIcon />
                            Dark
                        </ToggleButton>
                        <ToggleButton value='light' className='IconToggleButton'>
                            <LightModeRoundedIcon />
                            Light
                        </ToggleButton>
                    </ToggleButtonGroup>
                </ListItem>
                <ListItem sx={{ color: 'text.secondary', fontSize: 14, pb: 0 }}>
                    Prepend User
                </ListItem>
                <ListItem>
                    <ToggleButtonGroup value={props.prepend} exclusive onChange={(_, newOption) => props.handleChangePrepend(newOption)}>
                        <ToggleButton disabled={!props.session} value={true}>Enabled</ToggleButton>
                        <ToggleButton value={false}>Disabled</ToggleButton>
                    </ToggleButtonGroup>
                </ListItem>
                <ListItem sx={{ color: 'text.secondary', fontSize: 14, pb: 0 }}>
                    Link Length
                </ListItem>
                <ListItem>
                    <ToggleButtonGroup value={props.length} exclusive fullWidth onChange={(_, newOption) => props.handleChangeLength(newOption)}>
                        <ToggleButton value={8}>8</ToggleButton>
                        <ToggleButton value={12}>12</ToggleButton>
                        <ToggleButton value={16}>16</ToggleButton>
                        <ToggleButton value={20}>20</ToggleButton>
                    </ToggleButtonGroup>
                </ListItem>
            </List>
            <List sx={{ '& .MuiSvgIcon-root': { mr: 1 } }}>
                <ListItem sx={{ '& > .MuiToggleButton-root' : { color: 'text.primary', flexGrow: 1, p: 1.5 }, mt: 'auto' }}>
                    <ToggleButton href='https://github.com/tonyma99/short' value={0}>
                        <GitHubIcon />
                        GitHub
                    </ToggleButton>
                    <ToggleButton href='https://tonyma.ca' value={0} sx={{ ml: 1 }}>
                        <HomeRoundedIcon />
                        Website
                    </ToggleButton>
                </ListItem>
            </List>
        </Drawer>
    )
}
