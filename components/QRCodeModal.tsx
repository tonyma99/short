import { useState } from 'react'
import Image from 'next/image'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'

export default function QRCodeModal(props: {
    handleCloseModal: () => void,
    qr: string
}) {
    const [open, setOpen] = useState(true)

    return (
        <Modal open={open} onClose={() => {setOpen(false); props.handleCloseModal()}}>
            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                <Image width={200} height={200} alt='Generated QR code' src={props.qr} />
            </Box>   
        </Modal>
    )
}
