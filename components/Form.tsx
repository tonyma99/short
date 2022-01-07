import LoadingButton from '@mui/lab/LoadingButton'
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Divider from '@mui/material/Divider'
import Fade from '@mui/material/Fade'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const inputRef = React.createRef<HTMLInputElement>()
let rows: { full: string, short: string }[] = []

export default function Form() {
    const [error, setError] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [hidden, setHidden] = useState(true)
    const [valid, setValid] = useState(false)

    const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
    
    useEffect(() => {
        const validURL = () =>{
            const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
            if (pattern.test(input)) {
                setValid(true)
                setError(false)
            } else {
                setValid(false)
                input.length > 0 ? setError(true) : setError(false)
            }
        }
        validURL()
    }, [input])

    useEffect(() => {
        const links = localStorage.getItem("links")
        if (links && JSON.parse(links).length > 0) {
            rows = JSON.parse(localStorage.getItem("links"))
            setHidden(false)
        } else {
            localStorage.setItem("links", JSON.stringify([]))
            setHidden(true)
        }
    })

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!pattern.test(input)) {
            setValid(false)
            input.length > 0 ? setError(true) : setError(false)
            return
        }

        setLoading(true)

        const response = await fetch('/api/shorten', {
            method: 'POST',
            body: input,
        })

        if (response.status == 200) {
            rows = JSON.parse(localStorage.getItem("links"))
            rows.push({
                full: input,
                short: (await response.json()).shortUrl
            })
            if (rows.length > 5) rows.shift()
            localStorage.setItem("links", JSON.stringify(rows))
        } else {
            setError(true)
        }
        
        setHidden(false)
        setInput('')
        inputRef.current.blur()
        setValid(false)
        setLoading(false)
    }
    
    return (
        <>
            <form onSubmit={handleSubmit} noValidate>
                <Container disableGutters sx={{ display: 'flex' }}>
                    <TextField
                        error={error}
                        onInput={handleInput}
                        id="inputField"
                        label="URL"
                        name="fullURL"
                        type="url"
                        variant="outlined"
                        autoComplete="off"
                        value={input}
                        inputProps={{
                            autoCapitalize: 'off',
                            autoCorrect: 'off',
                            spellCheck: 'false'
                        }}
                        inputRef={inputRef}
                        sx={{
                            flex: 1
                        }} />

                    <LoadingButton
                        loading={loading}
                        disabled={!valid}
                        type="submit"
                        variant="contained"
                        sx={{
                            fontSize: '1.1em',
                            fontWeight: 'bold',
                            ml: 1,
                            textTransform: 'none'
                        }}>
                        Shorten
                    </LoadingButton>
                </Container>
            </form>

            <Fade in={!hidden} timeout={350}>
                <Box hidden={hidden}>
                    <Divider sx={{ my: 2 }}></Divider>
                    <TableContainer
                        hidden={hidden}
                        sx={{
                            borderColor: 'primary.main',
                            borderRadius: 1,
                            borderStyle: 'solid',
                            borderWidth: 1,
                            my: 1
                        }}>
                        <Table>
                            <TableBody>
                                {(rows.slice(0).reverse()).map((row) => (
                                    <TableRow
                                    hover
                                    key={rows.indexOf(row)}
                                    sx={{ 
                                        '&:first-of-type td, &:first-of-type th': { fontWeight: 'bold' },
                                        '&:last-child td, &:last-child th': { border: 0 }
                                    }}
                                    >
                                        <TableCell scope="row" sx={{ whiteSpace: 'nowrap' }}>
                                            {row.full}
                                        </TableCell>
                                        <TableCell align="right" scope="row" sx={{ whiteSpace: 'nowrap' }}>{row.short}</TableCell>
                                        <TableCell align="right" scope="row" sx={{ whiteSpace: 'nowrap', width: 0 }}>
                                            <Link
                                                onClick={() => navigator.clipboard.writeText(row.short)}
                                                sx={{
                                                    '&:active': {
                                                        color: 'text.primary',
                                                    },
                                                    cursor: 'pointer',
                                                    textDecoration: 'none',
                                                    textTransform: 'none',
                                                    whiteSpace: 'nowrap',
                                                    userSelect: 'none'
                                                }}>
                                                Copy to clipboard
                                            </Link>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Link
                        onClick={() => {setHidden(true); localStorage.setItem("links", JSON.stringify([]))}}
                        sx={{
                            '&:active': {
                                color: 'text.primary',
                            },
                            cursor: 'pointer',
                            fontSize: '0.8em',
                            fontWeight: 'bold',
                            textDecoration: 'none',
                            textTransform: 'none',
                            whiteSpace: 'nowrap',
                            userSelect: 'none'
                        }}>
                        Clear
                    </Link>
                </Box>
            </Fade>
        </>
    )
}
