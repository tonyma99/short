import React, { ChangeEvent, FormEvent, useState } from 'react'
import Button from '@mui/material/Button'
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
    const [errorMessage, setErrorMessage] = useState('')
    const [input, setInput] = useState('')
    
    const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
        const userID = event.target.value
        if (userID.length <= 16) {
            setErrorMessage('')
            setInput(userID)
        }
        (userID.length > 3) ? setError(false) : setError(true)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        inputRef.current.blur()

        if (!(input.length >= 4 && input.length <= 16)) {
            setInput('')
            setError(true)
            setErrorMessage('User ID must be between 4 and 16 characters in length.')
            return
        }

        if (!input.match('^[a-zA-Z0-9]*$')) {
            setInput('')
            setError(true)
            setErrorMessage('User ID must only contain letters and numbers.')
            return
        }

        setInput('')
        props.handleLogIn(input)
        props.handleCloseLogIn()
    }
    
    return (
        <Dialog
            open={props.login}
            onClose={() => {
                setError(false)
                setErrorMessage('')
                setInput('')
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
                        error={error}
                        fullWidth
                        helperText={errorMessage}
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
                    <Button 
                        disabled={error}
                        type='submit'
                        variant='contained'
                        fullWidth
                        sx={{ display: 'block', fontSize: 16, height: 56 }}>
                        Login
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    )
}
