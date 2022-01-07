import * as React from 'react';
import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import GitHubIcon from '@mui/icons-material/GitHub';

export default function Header() {
  return (
    <>
        <Box sx={{ display: 'flex', borderBottomColor: 'divider', borderBottomStyle: 'solid', borderBottomWidth: 1, minHeight: 64 }}> 
            <Container maxWidth="md" sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                <Typography variant="h6" component="div">
                <Link href="/" underline="none" sx={{ fontWeight: 'bold' }}>
                    Short
                </Link>
                </Typography>
                <Link href="https://github.com/tonyma99/short/" sx={{ marginLeft: 'auto' }}>
                    <GitHubIcon fontSize="large" />
                </Link>
            </Container>
        </Box>
    </>
  )
}
