import { useCallback, useEffect, useState, MouseEventHandler } from 'react'
import Head from 'next/head'
import { useSession } from 'next-auth/react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Form from '../components/Form'
import HistoryEntries from '../components/HistoryEntries'
import Layout from '../components/Layout'
import RecentEntries from '../components/RecentEntries'
import TabToggle from '../components/TabToggle'

export default function Home(props: { toggleTheme:MouseEventHandler<HTMLAnchorElement>, theme:string }) {
    const [loaded, setLoaded] = useState(false)
    const [length, setLength] = useState(8)
    const [prepend, setPrepend] = useState(false)
    const [tab, setTab] = useState<'submit' | 'history'>('submit')

    const [history, setHistory] = useState([])
    const [recent, setRecent] = useState([])

    const { data: session } = useSession()

    const addRecent = (entry: RecentEntryJSON) => {
        let savedState = JSON.parse(sessionStorage.getItem('state'))
        savedState.recent.push(entry)
        setRecent(savedState.recent)
        sessionStorage.setItem('state', JSON.stringify(savedState))
    }

    const handleChangeTheme = (event: any, newOption: string) => {
        if (newOption != null) props.toggleTheme(event)
    }

    const handleChangeLength = (newOption: number) => {
        if (newOption != null) {
            setLength(newOption)

            let savedState = JSON.parse(sessionStorage.getItem('state'))
            savedState.length = newOption
            sessionStorage.setItem('state', JSON.stringify(savedState))
        }
    }

    const handleChangePrepend = (newOption: boolean) => {
        if (newOption != null) {
            setPrepend(newOption)

            let savedState = JSON.parse(sessionStorage.getItem('state'))
            savedState.prepend = newOption
            sessionStorage.setItem('state', JSON.stringify(savedState))
        }
    }

    const handleTabChange = (_: React.MouseEvent<HTMLElement>, newTab: string | null) => {
        if ((newTab === 'submit' || newTab === 'history') && newTab !== null ) {
            setTab(newTab)
            let savedState = JSON.parse(sessionStorage.state)
            savedState.tab = newTab
            sessionStorage.setItem('state', JSON.stringify(savedState))
        }
    }

    const loadData = useCallback(async () => {
        if (session) {
            const response = await fetch('/api/links/')

            if (response.status === 200) {
                setHistory((await response.json()).data.reverse())
            }

            setLoaded(true)
        }
    }, [session])

    useEffect(() => {
        const state = sessionStorage.getItem('state')
        if (state) {
            const savedState = JSON.parse(state)
            setLength(savedState.length)
            setPrepend(savedState.prepend)
            setRecent(savedState.recent)
            setTab(savedState.tab)
        } else {
            sessionStorage.setItem('state', JSON.stringify({
                recent: [],
                length: 8,
                prepend: false,
                theme: 'dark',
                tab: 'submit'
            }))
        }        
        loadData()
    }, [loadData])

    return (
        <Layout handleChangeLength={handleChangeLength} handleChangePrepend={handleChangePrepend} handleChangeTheme={handleChangeTheme} length={length} prepend={prepend} session={session} theme={props.theme}>
            <Head>
                <title>Short</title>
                <meta name="description" content="URL shortener" />
                <meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0, width=device-width" />
                <link rel="icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📎</text></svg>" />
            </Head>
            
            <Box sx={{ my: 4, userSelect: 'none' }}>
                <Typography variant='h1' component='h1' sx={{ fontSize: {xs: '16vw', sm: 'h1.fontSize'}, fontWeight: 800 }}>
                    Short
                </Typography>
                <Typography>
                    A simple URL shortener.
                </Typography>
            </Box>

            <Box sx={{ my: 4 }}>
                {session && <TabToggle handleTabChange={handleTabChange} tab={tab} />}

                {tab === 'submit' ?
                    <>
                    <Form addRecent={addRecent} loadData={loadData} length={length} prepend={prepend} />
                    {recent && recent.length > 0 && tab ==='submit' && <RecentEntries recent={recent} />}
                    </>
                : 
                    <>
                    {session && <HistoryEntries history={history} loaded={loaded} session={session} />}
                    </>
                }
            </Box>
        </Layout>
    )
}
