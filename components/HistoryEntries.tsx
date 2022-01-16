import { MouseEvent, useState } from 'react'
import { Session } from 'next-auth'
import KeyboardArrowLeftRoundedIcon from '@mui/icons-material/KeyboardArrowLeftRounded'
import KeyboardArrowRightRoundedIcon from '@mui/icons-material/KeyboardArrowRightRounded'
import KeyboardDoubleArrowLeftRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowLeftRounded'
import KeyboardDoubleArrowRightRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowRightRounded'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import Paper from '@mui/material/Paper'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableFooter from '@mui/material/TableFooter'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import CheckRoundedIcon from '@mui/icons-material/CheckRounded'
import ContentPasteRoundedIcon from '@mui/icons-material/ContentPasteRounded'
import QrCodeRoundedIcon from '@mui/icons-material/QrCodeRounded'
import QRCodeModal from './QRCodeModal'

interface TablePaginationActionsProps {
    count: number
    page: number
    rowsPerPage: number
    onPageChange: (
        event: React.MouseEvent<HTMLButtonElement>,
        newPage: number,
    ) => void
}

function TablePaginationActions(props: TablePaginationActionsProps) {
    const { count, page, rowsPerPage, onPageChange } = props

    const handleFirstPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0)
    }

    const handleBackButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1)
    }

    const handleLastPageButtonClick = (event: MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <Box sx={{ flexShrink: 0, ml: 2.5 }}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
            >
                <KeyboardDoubleArrowLeftRoundedIcon />
            </IconButton>
            <IconButton
                onClick={handleBackButtonClick}
                disabled={page === 0}
            >
                <KeyboardArrowLeftRoundedIcon />
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                <KeyboardArrowRightRoundedIcon />
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                <KeyboardDoubleArrowRightRoundedIcon />
            </IconButton>
        </Box>
    )
}

export default function HistoryEntries(props: {
    history: HistoryEntryJSON[],
    loaded: boolean,
    session: Session
}) {
    const [copied, setCopied] = useState('')
    const [qrCode, setQrCode] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - props.history.length) : 0

    const handleCopyButtonClicked = async (url: string) => {
        setCopied(url)
        navigator.clipboard.writeText(url)
        await new Promise(resolve => setTimeout(resolve, 1500))
        setCopied('')
    }

    const handleChangePage = (_: React.MouseEvent<HTMLElement>, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleGenerateQr = (url: string) => {
        const QRCode = require('qrcode')

        QRCode.toDataURL(url).then((qr: string) => { setQrCode(qr) })
    }

    return (
        <>
        {props.loaded ?
            <Box>
                {props.history.length > 0 ?
                    <Box>
                        <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
                            <Table sx={{ minWidth: 500 }}>
                                <TableHead>
                                    <TableRow sx={{ '& td, & th': { fontWeight: 'bold' } }}>
                                        <TableCell />
                                        <TableCell />
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Full URL</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Short URL</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Creation Date</TableCell>
                                        <TableCell sx={{ whiteSpace: 'nowrap' }}>Clicks</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(rowsPerPage > 0
                                        ? props.history.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        : props.history
                                    ).map((row, idx) => (
                                        <TableRow hover key={idx}>
                                            <TableCell scope='row' sx={{ whiteSpace: 'nowrap', pl: 1, pr: 0, py: 0, width: 0 }}>
                                                <IconButton onClick={() => handleCopyButtonClicked(row.shortUrl)} sx={{ bgcolor: 'rgba(0,0,0,0)', border: 'none' }}>
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
                                            <TableCell scope='row' sx={{ whiteSpace: 'nowrap' }}>
                                                <Link href={row.fullUrl}>{row.fullUrl}</Link>
                                            </TableCell>
                                            <TableCell scope='row' sx={{ whiteSpace: 'nowrap' }}>
                                                <Link href={row.shortUrl}>{row.shortUrl}</Link>
                                            </TableCell>
                                            <TableCell scope='row' sx={{ whiteSpace: 'nowrap' }}>
                                                {row.created}
                                            </TableCell>
                                            <TableCell align='right' scope='row' sx={{ whiteSpace: 'nowrap', width: 0 }}>
                                                {row.count}
                                            </TableCell>
                                        </TableRow>
                                    ))}

                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 53 * emptyRows }}>
                                        <TableCell colSpan={6} />
                                        </TableRow>
                                    )}
                                </TableBody>
                                <TableFooter>
                                    <TableRow sx={{ pr: 2}}>
                                        <TablePagination
                                            ActionsComponent={TablePaginationActions}
                                            onPageChange={handleChangePage}
                                            onRowsPerPageChange={handleChangeRowsPerPage}
                                            colSpan={6}
                                            count={props.history.length}
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                            SelectProps={{ native: true }}
                                            sx={{ 
                                                '& .MuiTablePagination-displayedRows': { fontSize: '0.9em' },
                                                '& .MuiTablePagination-selectLabel': { fontSize: '0.9em' },
                                                '& .MuiTablePagination-select:focus': { background: 'none' },
                                                '& .MuiTablePagination-toolbar': { pr: 0.8 },
                                                '& .MuiTablePagination-toolbar > .MuiBox-root > *:not(:last-child)': { mr: 0.5 },
                                                borderBottom: 'none'
                                            }}
                                        />
                                    </TableRow>
                                </TableFooter>
                            </Table>
                        </TableContainer>
                    </Box>
                    :
                    <Box>
                        <Typography sx={{ color: 'error.main', fontWeight: 'bold', p: 2 }}>
                            No links found.
                        </Typography>
                    </Box>
                }
            </Box>
        :
            <Box sx={{ py: '13px' }}>
                <CircularProgress color='inherit' size={24} thickness={6} />
            </Box>
        }

        {qrCode && <QRCodeModal handleCloseModal={() => setQrCode('')} qr={qrCode} />}
        </>
    )
}
