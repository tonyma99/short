import DeleteIcon from '@mui/icons-material/Delete';
import LinkIcon from '@mui/icons-material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField'
import React, { ChangeEvent, FormEvent, useState } from 'react'

const inputRef = React.createRef<HTMLInputElement>();

export default function Form() {
    const [error, setError] = useState(false);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [shortUrlAbs, setShortUrlAbs] = useState('')
    const [show, setShow] = useState(false);
    const [text, setText] = useState('');
    const [valid, setValid] = useState(false);

    const validURL = (url: string) =>{
        let pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)

        if (pattern.test(url)) {
            setValid(true)
            setError(false)
            return true
        } else {
            setValid(false)
            input.length > 0 ? setError(true) : setError(false)
            return false
        }
    }

    const sleep = (delay: number) => {
        return new Promise( res => setTimeout(res, delay) );
    }

    const handleClick = async () => {
        navigator.clipboard.writeText(shortUrlAbs)
        setText("Copied to clipboard")
        await sleep(1000)
        setText(shortUrlAbs)
    }

    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        setInput(event.target.value)
        validURL(input)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!validURL(input)) {
            setInput('')
            return
        }

        setShow(false)
        setLoading(true)

        const response = await fetch('/api/shorten', {
            method: 'POST',
            body: input,
        })

        const data = await response.json()

        if (data.success) {
            setShortUrlAbs(`http://${process.env.DOMAIN}/${data.message}`)
            setText(`http://${process.env.DOMAIN}/${data.message}`)
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
                    label={text}
                    onClick={handleClick}
                    onDelete={() => {setShow(false)}}
                    deleteIcon={<DeleteIcon />}
                    icon={<LinkIcon />}
                    variant="outlined"
                    sx={{ backgroundColor: '#f4f4f4', borderRadius: 1.5 ,fontSize: 16, height: 56, px: 1, my: 4 }}
                />
            </Fade>
        </>
    )
}
