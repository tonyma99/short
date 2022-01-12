import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Typography from '@mui/material/Typography'

export default function Footer() {
  return (
      <Box sx={{ display: 'flex', p: 2 }}> 
          <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
              <Typography sx={{ color: 'text.disabled', fontSize: '0.8em', userSelect: 'none' }}>
                  Tony Ma, 2021
              </Typography>
          </Container>
      </Box>
  )
}
