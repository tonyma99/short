import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import AttachmentRoundedIcon from '@mui/icons-material/AttachmentRounded'
import InsertChartRoundedIcon from '@mui/icons-material/InsertChartRounded'

export default function TabToggle(props: {
    handleTabChange: (_: React.MouseEvent<HTMLElement>, newTab: string) => void,
    tab: string
}) {
    return (
        <ToggleButtonGroup
            onChange={props.handleTabChange}
            exclusive
            sx={{ '& > .MuiToggleButton-root': { p: 1 }, mb: 2 }}
            value={props.tab}
        >
            <ToggleButton value='submit'>
                <AttachmentRoundedIcon />
            </ToggleButton>
            <ToggleButton value='history'>
                <InsertChartRoundedIcon />
            </ToggleButton>
        </ToggleButtonGroup>
    )
}