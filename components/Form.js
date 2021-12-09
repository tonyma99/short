import LinkIcon from '@mui/icons-material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip } from '@mui/material';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import TextField from '@mui/material/TextField'
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react'
import React from 'react';

export default function Form() {
    const [loading, setLoading] = useState(false);
    const [shortUrlAbs, setShortUrlAbs] = useState('')
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const [valid, setValid] = useState(false);

    const inputFieldRef = React.createRef();

    const validURL = string => {
        let pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)

        if (pattern.test(string)) {
            setValid(true)
            setError(false)
            return true
        } else {
            setValid(false)
            inputFieldRef.current.value.length > 0 ? setError(true) : setError(false)
            return false
        }
    }

    const handleInput = event => {
        validURL(event.target.value)
    }

    const handleSubmit = async event => {
        event.preventDefault()

        if (!validURL(inputFieldRef.current.value)) {
            return
        }

        setShow(false)
        setLoading(true)

        const response = await fetch('/api/shorten', {
            method: 'POST',
            body: event.target.fullURL.value,
        })

        const data = await response.json()

        if (data.success) {
            setShortUrlAbs(`http://${process.env.DOMAIN}/${data.message}`)
            setShow(true)
        } else {
            setError(true)
        }
        event.target.reset()
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
                        inputProps={{
                            autoCapitalize: 'off',
                            autoCorrect: 'off',
                            spellCheck: 'false'
                        }}
                        inputRef={inputFieldRef}
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
                    label={shortUrlAbs}
                    onClick={() => {navigator.clipboard.writeText(shortUrlAbs)}}
                    onDelete={() => {setShow(false)}}
                    deleteIcon={<DeleteIcon />}
                    icon={<LinkIcon />}
                    variant="contained"
                    sx={{ borderRadius: 1.5 ,fontSize: 16, height: 56, px: 1, my: 4 }}
                />
            </Fade>
        </>
    )
}
