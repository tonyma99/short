import React, { ChangeEvent, FormEvent, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

const inputRef = React.createRef<HTMLInputElement>()

export default function LogInMenu(props: {
    handleCloseLogIn: () => void,
    handleLogIn: (user: string) => void,
    login: boolean
}) {
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState(false)
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const userID = event.target.value
        if (userID.length < 16) {
            setErrorMessage(false)
            setInput(userID)
        }
        (userID.length > 3) ? setError(false) : setError(true)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (input.length <= 0 || input.length > 16) {
            setInput('')
            setError(true)
            return
        }

        if (!input.match('^[a-zA-Z0-9]*$')) {
            setInput('')
            setError(true)
            setErrorMessage(true)
            return
        }

        inputRef.current.blur()
        const userID = input

        setInput('')
        setError(false)
        setErrorMessage(false)
        setLoading(true)

        if (userID.length > 3 && userID.length < 16 && userID.length != 0) {
            props.handleLogIn(userID)
        } else {
            setError(true)
        }
        
        setLoading(false)
        props.handleCloseLogIn()
    }
    
    return (
        <Dialog
            open={props.login}
            onClose={props.handleCloseLogIn}
            PaperProps={{ elevation: 1 }}
            sx={{
                '& .MuiDialog-paper': {
                    backgroundColor: 'background.paper',
                    borderColor: 'divider',
                    borderRadius: '12px',
                    borderStyle: 'solid',
                    borderWidth: 1,
                    width: 320
                }
            }}
        >
            <DialogTitle sx={{ textAlign: 'center', p: 3, pb: 2 }}>
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Log In</Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoComplete='off'
                        error={error}
                        fullWidth
                        helperText={errorMessage ? 'Only letters and numbers are allowed': null}
                        inputProps={{
                            autoCapitalize: 'off',
                            autoCorrect: 'off',
                            spellCheck: 'false'
                        }}
                        inputRef={inputRef}
                        sx={{
                            display: 'block',
                            flex: 1,
                            my: 1
                        }}
                        onInput={handleInput}
                        label='User ID'
                        name='userID'
                        type='text'
                        value={input}
                        variant='outlined'
                    />
                    <LoadingButton 
                        disabled={error}
                        type='submit'
                        variant='contained'
                        fullWidth
                        loading={loading}
                        loadingIndicator={<CircularProgress color='inherit' size={24} thickness={6} />}
                        sx={{ display: 'block', fontSize: 16, height: 56 }}>
                        Login
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
