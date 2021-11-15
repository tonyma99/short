import LinkIcon from '@mui/icons-material/Link';
import LoadingButton from '@mui/lab/LoadingButton';
import { Chip } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Fade from '@mui/material/Fade';
import Link from '@mui/material/Link'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';
import { useState } from 'react'

export default function Form() {
    const [loading, setLoading] = useState(false);
    const [shortUrl, setShortUrl] = useState('')
    const [shortUrlAbs, setShortUrlAbs] = useState('')
    const [show, setShow] = useState(false);
    const [error, setError] = useState(false);
    const [valid, setValid] = useState(false)

    const validURL = string => {
        try {
            let url = new URL(string)
        } catch (error) {
            return false
        }
        return true
    }

    const handleInput = event => {
        if (validURL(event.target.value)) {
            setValid(true)
            setError(false)
        } else {
            setValid(false)
            event.target.value.length > 0 ? setError(true) : setError(false)
        }
    }

    const handleClick = async event => {
        event.preventDefault()
        setShow(false)
        setLoading(true)
        
        const response = await fetch('/api/shorten', {
            method: 'POST',
            body: event.target.fullURL.value,
        })
        const data = await response.json()

        if (data.success) {
            setShortUrl(`${data.message}`)
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
            <form onSubmit={handleClick}>
                <Container disableGutters sx={{ display: 'flex' }}>
                    <TextField
                        error={error}
                        onInput={handleInput}
                        id="outlined-basic"
                        label="URL"
                        type="url"
                        name="fullURL"
                        variant="outlined"
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
