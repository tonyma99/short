import React, { ChangeEvent, FormEvent, useCallback, useEffect, useState } from 'react'
import DataTable from './DataTable'
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded'
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded'
import { alpha } from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import Typography from '@mui/material/Typography'

const inputRef = React.createRef<HTMLInputElement>()

let dataRows: { fullUrl: string, shortUrl: string, date: string, count: number }[] = []
let recentRows: { full: string, short: string }[] = []

export default function Form(props: { length: number, theme: string, prepend: boolean, tab: string, user: string, handleTabChange: (_: React.MouseEvent<HTMLElement>, newTab: string) => void }) {
    const [copied, setCopied] = useState('')
    const [error, setError] = useState(false)
    const [hidden, setHidden] = useState(true)
    const [input, setInput] = useState('')
    const [loaded, setLoaded] = useState(false)
    const [loading, setLoading] = useState(false)

    const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)

    const handleCopyButtonClicked = async (url: string) => {
        setCopied(url)
        navigator.clipboard.writeText(url)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setCopied('')
    }

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        if (pattern.test(value)) {
            setError(false)
        } else {
            setError(true)
        }
        setInput(value)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        
        if (!pattern.test(input)) {
            setError(true)
            return
        }

        setLoading(true)

        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: input,
                user: props.user ? props.user : null,
                prepend: props.prepend,
                length: props.length
            })
        })

        if (response.status === 200) {
            recentRows = JSON.parse(localStorage.getItem('state')).data
            recentRows.push({
                full: input,
                short: (await response.json()).shortUrl
            })
            let savedState = JSON.parse(localStorage.getItem('state'))
            savedState.data = recentRows
            localStorage.setItem('state', JSON.stringify(savedState))
        } else {
            setError(true)
        }

        loadData()
        
        setHidden(false)
        setInput('')
        inputRef.current.blur()
        setLoading(false)
    }

    const loadData = useCallback(async () => {
        const user = props.user

        if (user) {
            const response = await fetch('/api/links/' + user)

            if (response.status === 200) {
                dataRows = (await response.json()).data.reverse()
            }

            setLoaded(true)
            inputRef.current.blur()
        }
    }, [props.user])

    useEffect(() => {
        const savedState = JSON.parse(localStorage.getItem('state'))
        if (savedState.data.length > 0) {
            recentRows = savedState.data
            setHidden(false)
        }
        loadData()
    }, [loadData])
    
    return (
        <Box sx={{ my: 4 }}>
            {props.user ?
                <ToggleButtonGroup
                    exclusive
                    value={props.tab}
                    onChange={props.handleTabChange}
                    sx={{ '& > .MuiToggleButton-root': { p: 1 }, mb: 2 }}
                >
                    <ToggleButton value='submit'>
                        <AttachmentRoundedIcon />
                    </ToggleButton>
                    <ToggleButton value='data'>
                        <InsertChartRoundedIcon />
                    </ToggleButton>
                </ToggleButtonGroup>
            :
                null
            }
            
            <form hidden={!(props.tab === 'submit')} onSubmit={handleSubmit} noValidate>
                <Container disableGutters sx={{ display: 'flex' }}>
                    <TextField
                        autoComplete='off'
                        error={error}
                        inputProps={{
                            autoCapitalize: 'off',
                            autoCorrect: 'off',
                            spellCheck: 'false'
                        }}
                        inputRef={inputRef}
                        label='URL'
                        onInput={handleInput}
                        type='url'
                        value={input}
                        sx={{ flex: 1 }}
                    />
                    <LoadingButton
                        disabled={error}
                        loading={loading}
                        loadingIndicator={<CircularProgress color='inherit' size={24} thickness={6} />}
                        sx={{ ml: 1 }}
                        type='submit'
                        variant='contained'
                    >
                        <Typography sx={{ fontWeight: 'bold' }}>Shorten</Typography>
                    </LoadingButton>
                </Container>

                <Box hidden={hidden}>
                    <Divider sx={{ my: 2 }}></Divider>
                    <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                        <Table>
                            <TableBody>
                                {(recentRows.slice(~5 + 1).reverse()).map((row, index) => (
                                    <TableRow
                                        hover
                                        key={index}
                                        sx={{ '&:first-of-type td, &:first-of-type th': { fontWeight: 'bold' }, '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell scope='row' sx={{ whiteSpace: 'nowrap', px: 1, py: 0, width: 0 }}>
                                            <IconButton
                                                sx={{ bgcolor: alpha('#FFF', 0), border: 'none' }}
                                                onClick={() => handleCopyButtonClicked(row.short)}
                                            >
                                                {copied === row.short ?
                                                <CheckRoundedIcon color='success' />
                                                :
                                                <ContentPasteRoundedIcon />
                                                }
                                            </IconButton>
                                        </TableCell>
                                        <TableCell sx={{ pl: 0, whiteSpace: 'nowrap' }}><Link href={row.short}>{row.short}</Link></TableCell>
                                        <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>{row.full}</TableCell>                  
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </form>
            
            <Box hidden={!(props.tab === 'data')}>
                {loaded ?
                <Box>
                    <Box hidden={!(dataRows.length > 0)}>
                        <DataTable rows={dataRows} user={props.user} />
                    </Box>
                    
                    <Box hidden={!(dataRows.length === 0)}>
                        <Typography sx={{ color: 'error.main', fontWeight: 'bold', p: 2 }}>
                            No links found
                        </Typography>
                    </Box>
                </Box>
                :
                <Box sx={{ py: '13px' }}>
                    <CircularProgress color='inherit' size={24} thickness={6} />
                </Box>
                }
            </Box>
        </Box>
    )
}
