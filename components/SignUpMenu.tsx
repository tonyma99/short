import { ChangeEvent, FormEvent, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export default function SignUpMenu(props: {
    handleCloseSignUp: () => void,
    handleSignUp: (user: string, password: string) => Promise<boolean>,
    signup: boolean
}) {
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [passwordInput, setPasswordInput] = useState('')
    const [userInput, setUserInput] = useState('')

    const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
        const password = event.target.value
        if (password.length <= 64) {
            setError(false)
            setErrorMessage('')
            setPasswordInput(password)
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (!userInput.match('^[a-zA-Z0-9]*$')) {
            setError(true)
            setErrorMessage('User ID must only contain letters and numbers.')
            return
        } else if (!(userInput.length >= 4 && userInput.length <= 16)) {
            setError(true)
            setErrorMessage('User ID must be between 4 and 16 characters in length.')
            return
        } else if (!(passwordInput.length >= 8 && passwordInput.length <= 64)) {
            setError(true)
            setErrorMessage('Password must be between 8 and 64 characters in length.')
            return
        }  

        setLoading(true)
        setUserInput('')
        setPasswordInput('')

        if (!(await props.handleSignUp(userInput, passwordInput))) {
            setError(true)
            setErrorMessage('User already exists.')
        }

        setLoading(false)
    }

    const handleUserInput = (event: ChangeEvent<HTMLInputElement>) => {
        const username = event.target.value
        if (username.length <= 16) {
            setError(false)
            setErrorMessage('')
            setUserInput(username)
        }
    }
    
    return (
        <Dialog
            open={props.signup}
            onClose={() => {
                setError(false)
                setErrorMessage('')
                setUserInput('')
                props.handleCloseSignUp()
            }}
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
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Sign Up</Typography>
            </DialogTitle>
            <DialogContent sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoComplete='off'
                        disabled={loading}
                        error={error}
                        fullWidth
                        inputProps={{
                            autoCapitalize: 'off',
                            autoCorrect: 'off',
                            spellCheck: 'false'
                        }}
                        label='Username'
                        name='username'
                        onInput={handleUserInput}
                        sx={{
                            display: 'block',
                            flex: 1,
                            my: 1
                        }}
                        type='text'
                        value={userInput}
                        variant='outlined'
                    />
                    <TextField
                        autoComplete='off'
                        disabled={loading}
                        error={error}
                        fullWidth
                        helperText={errorMessage}
                        inputProps={{
                            autoCapitalize: 'off',
                            autoCorrect: 'off',
                            spellCheck: 'false'
                        }}
                        label='Password'
                        name='password'
                        onInput={handlePasswordInput}
                        sx={{
                            display: 'block',
                            flex: 1,
                            my: 1
                        }}
                        type='password'
                        value={passwordInput}
                        variant='outlined'
                    />
                    <LoadingButton 
                        disabled={error}
                        fullWidth
                        loading={loading}
                        loadingIndicator={<CircularProgress color='inherit' size={28} thickness={6} />}
                        sx={{ display: 'block', fontSize: 16, height: 56 }}
                        type='submit'
                        variant='contained'
                    >
                        Sign Up
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
