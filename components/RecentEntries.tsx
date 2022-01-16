import { useState } from 'react'
import QRCodeModal from './QRCodeModal'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableRow from '@mui/material/TableRow'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'

export default function RecentEntries(props: {
    recent: RecentEntryJSON[]
}) {
    const [copied, setCopied] = useState('')
    const [qrCode, setQrCode] = useState('')

    const handleCopyButtonClicked = async (url: string) => {
        setCopied(url)
        navigator.clipboard.writeText(url)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setCopied('')
    }

    const handleGenerateQr = (url: string) => {
        const QRCode = require('qrcode')

        QRCode.toDataURL(url).then((qr: string) => { setQrCode(qr) })
    }

    return (
        <Box>
            <Divider sx={{ my: 2 }}></Divider>
            <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                <Table>
                    <TableBody>
                        {(props.recent.slice(~5 + 1).reverse()).map((row, index) => (
                            <TableRow
                                hover
                                key={index}
                                sx={{ '&:first-of-type td, &:first-of-type th': { fontWeight: 'bold' }, '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell scope='row' sx={{ whiteSpace: 'nowrap', pl: 1, pr: 0, py: 0, width: 0 }}>
                                    <IconButton
                                        sx={{ bgcolor: 'rgba(0,0,0,0)', border: 'none' }}
                                        onClick={() => handleCopyButtonClicked(row.shortUrl)}
                                    >
                                        {copied === row.shortUrl ?
                                        <CheckRoundedIcon color='success' />
                                        :
                                        <ContentPasteRoundedIcon />
                                        }
                                    </IconButton>
                                </TableCell>
                                <TableCell scope='row' sx={{ whiteSpace: 'nowrap', pl: 0, pr: 1, py: 0, width: 0 }}>
                                    <IconButton onClick={() => handleGenerateQr(row.shortUrl)} sx={{ bgcolor: 'rgba(0,0,0,0)', border: 'none' }}>
                                        <QrCodeRoundedIcon />
                                    </IconButton>
                                </TableCell>
                                <TableCell sx={{ pl: 0, whiteSpace: 'nowrap' }}><Link href={row.shortUrl}>{row.shortUrl}</Link></TableCell>
                                <TableCell align='right' sx={{ whiteSpace: 'nowrap' }}>{row.fullUrl}</TableCell>                  
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {qrCode && <QRCodeModal handleCloseModal={() => setQrCode('')} qr={qrCode} />}
        </Box>
    )
}
