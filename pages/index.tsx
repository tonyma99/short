import { useCallback, useEffect, useState, MouseEventHandler } from 'react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Menu from '../components/Menu'
import Footer from '../components/Footer'
import Form from '../components/Form'
import LogInMenu from '../components/LogInMenu'
import Header from '../components/Header'

export default function Home(props: { toggleTheme:MouseEventHandler<HTMLAnchorElement>, theme:string }) {
    const [length, setLength] = useState(8)
    const [menu, setMenu] = useState(false)
    const [prepend, setPrepend] = useState(false)
    const [login, setLogin] = useState(false)
    const [tab, setTab] = useState<'submit' | 'data'>('submit')
    const [user, setUser] = useState<string|null>(null)

    const handleChangeTheme = (event: any, newOption: string | null) => {
        if (newOption != null) props.toggleTheme(event)
    }

    const handleChangeLength = (newOption: number) => {
        if (newOption != null) {
            setLength(newOption)

            let savedState = JSON.parse(localStorage.getItem('state'))
            savedState.length = newOption
            localStorage.setItem('state', JSON.stringify(savedState))
        }
    }

    const handleChangePrepend = (newOption: boolean) => {
        if (newOption != null) {
            setPrepend(newOption)

            let savedState = JSON.parse(localStorage.getItem('state'))
            savedState.prepend = newOption
            localStorage.setItem('state', JSON.stringify(savedState))
        }
    }

    const handleLogIn = (user: string) => {
        setUser(user)
        setMenu(false)

        let savedState = JSON.parse(localStorage.getItem('state'))
        savedState.user = user
        localStorage.setItem('state', JSON.stringify(savedState))
    }

    const handleLogOut = () => {
        setPrepend(false)
        setTab('submit')
        setUser(null)

        let savedState = JSON.parse(localStorage.getItem('state'))
        savedState.prepend = false
        savedState.user = null
        localStorage.setItem('state', JSON.stringify(savedState))
        sessionStorage.setItem('state', JSON.stringify({ tab: 'submit' }))
    }

    const handleTabChange = (_: React.MouseEvent<HTMLElement>, newTab: string | null) => {
        if ((newTab === 'submit' || newTab === 'data') && newTab !== null ) {
            setTab(newTab)
            sessionStorage.setItem('state', JSON.stringify({ tab: newTab }))
        }
    }

    const handleToggleMenu = () => {
        menu ? setMenu(false) : setMenu(true)
    }

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('state'))
        setLength(savedState.length)
        setPrepend(savedState.prepend)
        setUser(savedState.user)
        if (sessionStorage.getItem('state')) {
            setTab(JSON.parse(sessionStorage.getItem('state')).tab)
        } else {
            sessionStorage.setItem('state', JSON.stringify({
                tab: 'submit'
            }))
        }
    }, [])

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Header toggleDrawer={handleToggleMenu} toggleTheme={props.toggleTheme} theme={props.theme} />
                
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Container maxWidth='md' sx={{ textAlign: 'center' }}>
                        <Box sx={{ my: 4, userSelect: 'none' }}>
                            <Typography variant='h1' component='h1' sx={{ fontSize: {xs: '16vw', sm: 'h1.fontSize'}, fontWeight: 800 }}>
                                Short
                            </Typography>
                            <Typography>
                                A simple URL shortener.
                            </Typography>
                        </Box>

                        <Form
                            handleTabChange={handleTabChange}
                            length={length}
                            prepend={prepend}
                            tab={tab}
                            theme={props.theme}
                            user={user}
                        />
                    </Container>                    
                </Box>

                <Footer />
            </Box>

            <LogInMenu
                handleCloseLogIn={() => setLogin(false)}
                login={login}
                handleLogIn={handleLogIn}
            />
            
            <Menu
                menu={menu}
                handleChangeTheme={handleChangeTheme}
                handleChangeLength={handleChangeLength}
                handleChangePrepend={handleChangePrepend}
                handleLogOut={handleLogOut}
                handleShowLogIn={() => setLogin(true)} 
                handleToggleMenu={handleToggleMenu}
                length={length}
                theme={props.theme}
                prepend={prepend}
                user={user}
            />
        </>
    )
}
