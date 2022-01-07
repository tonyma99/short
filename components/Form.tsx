import DeleteIcon from '@mui/icons-material/Delete'
import LinkIcon from '@mui/icons-material/Link'
import LoadingButton from '@mui/lab/LoadingButton'
import Chip from '@mui/material/Chip'
import Container from '@mui/material/Container'
import Fade from '@mui/material/Fade'
import TextField from '@mui/material/TextField'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

const inputRef = React.createRef<HTMLInputElement>()

export default function Form() {
    const [error, setError] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const [shortUrl, setShortUrl] = useState('')
    const [show, setShow] = useState(false)
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

    const sleep = (delay: number) => {
        return new Promise(res => setTimeout(res, delay))
    }

    const handleClick = async () => {
        navigator.clipboard.writeText(shortUrl)
        setShortUrl("Copied to clipboard")
        await sleep(1000)
        setShortUrl(shortUrl)
    }

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

        setShow(false)
        setLoading(true)

        const response = await fetch('/api/shorten', {
            method: 'POST',
            body: input,
        })

        if (response.status == 200) {
            setShortUrl((await response.json()).shortUrl)
            setShow(true)
        } else {
            setError(true)
        }
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
                            ml: 1
                        }}>
                        Shorten
                    </LoadingButton>
                </Container>
            </form>

            <Fade in={show}>
                <Chip
                    label={shortUrl}
                    onClick={handleClick}
                    onDelete={() => {setShow(false)}}
                    deleteIcon={<DeleteIcon />}
                    icon={<LinkIcon />}
                    color="info"
                    sx={{ borderRadius: 1, fontSize: 16, height: 56, px: 1, my: 4 }}
                />
            </Fade>
        </>
    )
}
