import { useState } from 'react';
import { Session} from 'next-auth'
import { signIn, signOut } from 'next-auth/react';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Footer from "./Footer";
import Header from "./Header";
import SignUpMenu from './SignUpMenu';
import LogInMenu from './LogInMenu';
import Menu from './Menu';

export default function Layout(props: {
    handleChangeLength: (newOption: number) => void,
    handleChangePrepend: (newOption: boolean) => void,
    handleChangeTheme: (event: any, newOption: string) => void,
    length?: number,
    prepend?: boolean,
    session: Session,
    theme: string,
    children?: any
}) {
    const [login, setLogin] = useState(false)
    const [menu, setMenu] = useState(false)
    const [signup, setSignup] = useState(false)

    const handleLogIn = async (username: string, password: string) => {
        if ((await signIn('credentials', { redirect: false, username, password })).ok) {
            setLogin(false)
            return true
        }
        return false
    }

    const handleLogOut = () => {
        let savedState = JSON.parse(sessionStorage.getItem('state'))
        savedState.prepend = false
        savedState.user = null
        savedState.tab = 'submit'
        sessionStorage.setItem('state', JSON.stringify(savedState))
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

    const handleToggleMenu = () => {
        menu ? setMenu(false) : setMenu(true)
    }

    return (
        <>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Header toggleMenu={handleToggleMenu} handleChangeTheme={props.handleChangeTheme} theme={props.theme} />
                <Box sx={{ display: 'flex', flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Container maxWidth='md' sx={{ textAlign: 'center' }}>
                        {props.children}
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
                handleChangeTheme={props.handleChangeTheme}
                handleChangeLength={props.handleChangeLength}
                handleChangePrepend={props.handleChangePrepend}
                handleLogOut={handleLogOut}
                handleShowLogIn={() => setLogin(true)}
                handleShowSignup={() => setSignup(true)}
                handleToggleMenu={handleToggleMenu}
                length={props.length}
                theme={props.theme}
                prepend={props.prepend}
                session={props.session}
            />
        </>
    )
}
