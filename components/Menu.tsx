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
                '& .MuiDrawer-paper': { width: '360px' },
                '& .MuiToggleButton-root' : { flexGrow: 1, py: '12px' },
                '& .MuiToggleButtonGroup-root': { flexGrow: 1 }
            }}
        >
            <List sx={{ p: 0 }}>
                <ListItem sx={{ borderBottomColor: 'divider', borderBottomStyle: 'solid', borderBottomWidth: '1px', py: '10px' }}>
                    <Typography variant='h6' sx={{ fontSize: '2 em', fontWeight: 'bold' }}>Settings</Typography>
                    <IconButton onClick={props.handleToggleMenu} sx={{ ml: 'auto' }}>
                        <CloseRoundedIcon/>
                    </IconButton>
                </ListItem>
            </List>
            <List sx={{ '& .MuiTypography-root': { fontSize: '1em', fontWeight: 'bold' }, '& .IconToggleButton > .MuiTypography-root': { ml: 1 }, mb: 'auto' }}>
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
                        <Typography>{props.session.user.username}</Typography>
                    </ToggleButton>
                </ListItem>
                :
                <>
                <ListItem sx={{  }}>
                    <ToggleButton onChange={props.handleShowLogIn} value={0} className='IconToggleButton' sx={{ color: 'text.primary' }}>
                        <LoginRoundedIcon />
                        <Typography>Log In</Typography>
                    </ToggleButton>
                </ListItem>
                <ListItem sx={{  }}>
                    <ToggleButton onChange={props.handleShowSignup} value={0} className='IconToggleButton' sx={{ color: 'text.primary' }}>
                        <AssignmentIndRoundedIcon />
                        <Typography>Sign Up</Typography>
                    </ToggleButton>
                </ListItem>
                </>
                }
                    
                <ListItem sx={{ pb: 0 }}>
                    <Typography>Theme</Typography>
                </ListItem>
                <ListItem>
                    <ToggleButtonGroup value={props.theme} exclusive onChange={props.handleChangeTheme}>
                        <ToggleButton value='dark' className='IconToggleButton'>
                            <DarkModeRoundedIcon />
                            <Typography>
                                Dark
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value='light' className='IconToggleButton'>
                            <LightModeRoundedIcon />
                            <Typography>
                                Light
                            </Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </ListItem>
                <ListItem sx={{ pb: 0 }}>
                    <Typography>Prepend User ID</Typography>
                </ListItem>
                <ListItem>
                    <ToggleButtonGroup value={props.prepend} exclusive onChange={(_, newOption) => props.handleChangePrepend(newOption)}>
                        <ToggleButton disabled={!props.session} value={true}>
                            <Typography>
                                Enabled
                            </Typography>
                        </ToggleButton>
                        <ToggleButton value={false}>
                            <Typography>
                                Disabled
                            </Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </ListItem>
                <ListItem sx={{ pb: 0 }}>
                    <Typography>Link Length</Typography>
                </ListItem>
                <ListItem>
                    <ToggleButtonGroup value={props.length} exclusive fullWidth onChange={(_, newOption) => props.handleChangeLength(newOption)}>
                        <ToggleButton value={8}>
                            <Typography>8</Typography>
                        </ToggleButton>
                        <ToggleButton value={12}>
                            <Typography>12</Typography>
                        </ToggleButton>
                        <ToggleButton value={16}>
                            <Typography>16</Typography>
                        </ToggleButton>
                        <ToggleButton value={20}>
                            <Typography>20</Typography>
                        </ToggleButton>
                    </ToggleButtonGroup>
                </ListItem>
            </List>
            <List sx={{ '& .MuiTypography-root': { fontSize: '1em', fontWeight: 'bold', ml: 1, mr: 0.5 } }}>
                <ListItem sx={{ '& > .MuiToggleButton-root' : { color: 'text.primary', flexGrow: 1, p: 1.5 }, mt: 'auto' }}>
                    <ToggleButton href='https://github.com/tonyma99/short' value={0}>
                        <GitHubIcon />
                        <Typography>GitHub</Typography>
                    </ToggleButton>
                    <ToggleButton href='https://tonyma.ca' value={0} sx={{ ml: 1 }}>
                        <HomeRoundedIcon />
                        <Typography>Website</Typography>
                    </ToggleButton>
                </ListItem>
            </List>
        </Drawer>
    )
}
