import { ChangeEvent, FormEvent, useState } from 'react'
import LoadingButton from '@mui/lab/LoadingButton'
import CircularProgress from '@mui/material/CircularProgress'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'

export default function LogInMenu(props: {
    handleCloseLogIn: () => void,
    handleLogIn: (user: string, password: string) => Promise<boolean>,
    login: boolean
}) {
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [passwordInput, setPasswordInput] = useState('')
    const [userInput, setUserInput] = useState('')

    const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 64) {
            setError(false)
            setErrorMessage('')
            setPasswordInput(event.target.value)
        }
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        setLoading(true)
        setUserInput('')
        setPasswordInput('')

        if (!(await props.handleLogIn(userInput, passwordInput))) {
            setError(true)
            setErrorMessage('Incorrect username or password.')
        }
        
        setLoading(false)
    }
    
    const handleUserInput = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.value.length <= 16) {
            setError(false)
            setErrorMessage('')
            setUserInput(event.target.value)
        }
    }
    
    return (
        <Dialog
            open={props.login}
            onClose={() => {
                setError(false)
                setErrorMessage('')
                setUserInput('')
                props.handleCloseLogIn()
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
                <Typography sx={{ fontSize: 18, fontWeight: 'bold' }}>Log In</Typography>
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
                        Log In
                    </LoadingButton>
                </form>
            </DialogContent>
        </Dialog>
    )
}
