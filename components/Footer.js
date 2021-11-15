import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import LanguageIcon from '@mui/icons-material/Language';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

export default function Footer() {
  return (
    <>
        <Box sx={{ display: 'flex', minHeight: 64 }}> 
            <Container sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
            <Link href="https://tonyma.ca/" sx={{ mx: '4px' }}>
                <LanguageIcon fontSize="medium" />
            </Link>
            <Link href="https://www.linkedin.com/in/tony-ma-1a0192211/" sx={{ mx: '4px' }}>
                <LinkedInIcon fontSize="medium" />
            </Link>
            <Link href="https://github.com/tonyma99/" sx={{ mx: '4px' }}>
                <GitHubIcon fontSize="medium" />
            </Link>
            </Container>
        </Box>
    </>
  )
}
