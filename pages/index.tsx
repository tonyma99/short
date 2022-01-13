import { useEffect, useState, MouseEventHandler } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'
import Footer from '../components/Footer'
import Form from '../components/Form'
import Header from '../components/Header'
import LogInMenu from '../components/LogInMenu'
import Menu from '../components/Menu'
import SignUpMenu from '../components/SignUpMenu'

export default function Home(props: { toggleTheme:MouseEventHandler<HTMLAnchorElement>, theme:string }) {
    const [length, setLength] = useState(8)
    const [login, setLogin] = useState(false)
    const [menu, setMenu] = useState(false)
    const [prepend, setPrepend] = useState(false)
    const [signup, setSignup] = useState(false)
    const [tab, setTab] = useState<'submit' | 'data'>('submit')

    const { data: session } = useSession()

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

    const handleLogIn = async (username: string, password: string) => {
        if ((await signIn('credentials', { redirect: false, username, password })).ok) {
            setLogin(false)
            return true
        }
        return false
    }

    const handleLogOut = () => {
        let savedState = JSON.parse(localStorage.getItem('state'))
        savedState.prepend = false
        savedState.user = null
        localStorage.setItem('state', JSON.stringify(savedState))
        sessionStorage.setItem('state', JSON.stringify({ tab: 'submit' }))
        signOut()
    }

    const handleSignUp = async (username: string, password: string) => {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        })

        if (response.status === 200) {
            setSignup(false)
            handleLogIn(username, password)
            return true
        }

        return false
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
                            session={session}
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

            <SignUpMenu
                handleCloseSignUp={() => setSignup(false)}
                signup={signup}
                handleSignUp={handleSignUp}
            />
            
            <Menu
                menu={menu}
                handleChangeTheme={handleChangeTheme}
                handleChangeLength={handleChangeLength}
                handleChangePrepend={handleChangePrepend}
                handleLogOut={handleLogOut}
                handleShowLogIn={() => setLogin(true)}
                handleShowSignup={() => setSignup(true)}
                handleToggleMenu={handleToggleMenu}
                length={length}
                theme={props.theme}
                prepend={prepend}
                session={session}
            />
        </>
    )
}
