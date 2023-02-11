import { useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Container from '@mui/material/Container'
import LoadingButton from '@mui/lab/LoadingButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export default function Form(props: {
    addRecent: (entry: RecentEntryJSON) => void,
    loadData: () => void,
    length: number,
    prepend: boolean
}) {
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)

    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        const pattern = new RegExp(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g)
        const value = event.target.value
        setErrorMessage('')
        if (pattern.test(value)) {
            setError(false)
        } else {
            setError(true)
        }
        setInput(value)
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setInput('')
        setLoading(true)

        const response = await fetch('/api/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                url: input,
                prepend: props.prepend,
                length: props.length
            })
        })

        if (response.status === 200) {
            props.addRecent({
                fullUrl: input,
                shortUrl: (await response.json()).shortUrl
            })
        } else {
            setError(true)
            if (response.status === 400) {
                setErrorMessage('Invalid URL.')
            } else if (response.status === 500) {
                setErrorMessage('The application has encountered an internal server error.')
            } else if (response.status === 406) {
                setErrorMessage('The specified URL has been marked as potentially harmful.')
            } else {
                setErrorMessage('The application has encountered an unknown error.')
            }
        }

        props.loadData()
        setLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} noValidate>
            <Container disableGutters sx={{ display: 'flex' }}>
                <TextField
                    autoComplete='off'
                    disabled={loading}
                    error={error}
                    helperText={errorMessage}
                    inputProps={{
                        autoCapitalize: 'off',
                        autoCorrect: 'off',
                        spellCheck: 'false'
                    }}
                    label='URL'
                    onInput={handleInput}
                    sx={{ flex: 1 }}
                    type='url'
                    value={input}
                />
                <LoadingButton
                    disabled={error}
                    loading={loading}
                    loadingIndicator={<CircularProgress color='inherit' size={24} thickness={6} />}
                    sx={{ height: 56, ml: 1 }}
                    type='submit'
                    variant='contained'
                >
                    <Typography sx={{ fontWeight: 'bold' }}>Shorten</Typography>
                </LoadingButton>
            </Container>
        </form>
    )
}
