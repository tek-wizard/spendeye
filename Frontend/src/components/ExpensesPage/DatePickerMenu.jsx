import React, { useState } from "react"
import {
  Box,
  Stack,
  Button,
  Divider,
  Menu,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar"
import { PickersDay } from "@mui/x-date-pickers/PickersDay"
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  format,
  isSameDay,
  isAfter,
  isWithinInterval,
  addMonths,
  isSameMonth,
} from "date-fns"

export const DatePickerMenu = ({
  anchorEl,
  onClose,
  dateRange,
  setDateRange,
}) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  // --- PRESETS ---
  const now = new Date()
  const datePresets = [
    { label: "This Month", range: [startOfMonth(now), endOfMonth(now)] },
    {
      label: "Last Month",
      range: [startOfMonth(subMonths(now, 1)), endOfMonth(subMonths(now, 1))],
    },
    { label: "This Year", range: [startOfYear(now), endOfYear(now)] },
    { label: "All Time", range: [new Date("1970-01-01"), now] },
  ]

  // --- STATE (default = All Time) ---
  const defaultAllTime = datePresets.find((p) => p.label === "All Time").range
  const [tempDateRange, setTempDateRange] = useState([
    dateRange?.startDate || defaultAllTime[0],
    dateRange?.endDate || defaultAllTime[1],
  ])
  const [start, end] = tempDateRange
  const [visibleMonths, setVisibleMonths] = useState([
    start || new Date(),
    addMonths(start || new Date(), 1),
  ])

  // --- CUSTOM DAY COMPONENT ---
  const CustomDay = (props) => {
    const { day, ...other } = props
    const isSelected = start && end && isWithinInterval(day, { start, end })
    const isStart = start && isSameDay(day, start)
    const isEnd = end && isSameDay(day, end)

    return (
      <PickersDay
        {...other}
        day={day}
        selected={false}
        disableMargin
        sx={{
          ...(isSelected && {
            borderRadius: 0,
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
            "&:hover, &:focus": { backgroundColor: theme.palette.primary.main },
          }),
          ...(isStart && {
            borderTopLeftRadius: "50%",
            borderBottomLeftRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }),
          ...(isEnd && {
            borderTopRightRadius: "50%",
            borderBottomRightRadius: "50%",
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
          }),
        }}
      />
    )
  }

  // --- HANDLERS ---
  const handleDateChangeMobile = (newDate) => {
    if (!start || (start && end)) setTempDateRange([newDate, null])
    else if (isAfter(newDate, start)) setTempDateRange([start, newDate])
    else setTempDateRange([newDate, null])
  }

  const handleStartChange = (newDate) => {
    const newEnd = end && isAfter(newDate, end) ? null : end
    setTempDateRange([newDate, newEnd])
  }

  const handleEndChange = (newDate) => {
    setTempDateRange([start, newDate])
  }

  const handleApply = () => {
    const [applyStart, applyEnd] = tempDateRange
    if (!applyStart || !applyEnd) return

    const preset = datePresets.find(
      (p) =>
        isSameDay(p.range[0], applyStart) && isSameDay(p.range[1], applyEnd)
    )
    const label = preset
      ? preset.label
      : `${format(applyStart, "MMM d")} - ${format(applyEnd, "MMM d, yyyy")}`

    setDateRange({ label, startDate: applyStart, endDate: applyEnd })
    onClose()
  }

  const selectedPreset = datePresets.find(
    (p) =>
      start && end && isSameDay(p.range[0], start) && isSameDay(p.range[1], end)
  )?.label

  const getHeaderText = () => {
    if (start && end)
      return `${format(start, "MMMM d, yyyy")} – ${format(end, "MMMM d, yyyy")}`
    if (start && !end) return "Now select an end date"
    return "Select a start date to begin"
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        sx: {
          mt: 1.5,
          borderRadius: 3,
          boxShadow: theme.shadows[6],
          border: "1px solid",
          borderColor: "divider",
          width: isMobile ? 340 : "auto",
        },
      }}
    >
      <LocalizationProvider dateAdapter={AdapterDateFns}>
            {/* THE DEFINITIVE FIX: This Stack now controls the fixed header/footer and scrollable content */}
            <Stack sx={{ height: { xs: '85vh', sm: 'auto' }, maxHeight: 700 }}>
                {/* --- HEADER: Shows the live selected range (Fixed) --- */}
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography sx={{ fontWeight: 'bold', minHeight: 24, fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                        {getHeaderText()}
                    </Typography>
                </Box>

                {/* --- SCROLLABLE CONTENT AREA --- */}
                <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', flexGrow: 1, overflowY: 'auto' }}>
                    {/* Presets Section */}
                    <Stack spacing={1} sx={{ p: 2, borderRight: isMobile ? 0 : 1, borderBottom: isMobile ? 1 : 0, borderColor: 'divider', minWidth: 150 }}>
                        {datePresets.map(p => (
                            <Button 
                                key={p.label}
                                variant={selectedPreset === p.label ? "contained" : "text"}
                                onClick={() => setTempDateRange(p.range)}
                                sx={{ justifyContent: 'flex-start' }}
                            >
                                {p.label}
                            </Button>
                        ))}
                    </Stack>

                    {/* Calendars Section */}
                    <Box sx={{ display: 'flex', p: isMobile ? 1 : 0 }}>
                        {isMobile ? (
                            <DateCalendar 
                                value={start}
                                onChange={handleDateChangeMobile}
                                slots={{ day: CustomDay }}
                                disableFuture
                            />
                        ) : (
                            <>
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ textAlign: "center", mb: 1 }}>Start Date</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mb: 1, minHeight: 30 }}>
                                      {start && !end ? "Select an end date to complete" : "Select the first day of your range"}
                                    </Typography>
                                    <DateCalendar
                                      value={start || new Date()}
                                      onChange={handleStartChange}
                                      month={visibleMonths[0]}
                                      onMonthChange={(date) => {
                                        const newStartMonth = date
                                        const newEndMonth = isSameMonth(date, visibleMonths[1]) ? addMonths(date, 1) : visibleMonths[1]
                                        setVisibleMonths([newStartMonth, newEndMonth])
                                      }}
                                      slots={{ day: CustomDay }}
                                      disableFuture
                                    />
                                </Box>
                                <Divider orientation="vertical" flexItem />
                                <Box sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" sx={{ textAlign: "center", mb: 1 }}>End Date</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", textAlign: "center", mb: 1, minHeight: 30 }}>
                                      {start && !end ? "Or click a day to finish" : "Select the last day of your range"}
                                    </Typography>
                                    <DateCalendar
                                      value={end || start || new Date()}
                                      onChange={handleEndChange}
                                      month={visibleMonths[1]}
                                      onMonthChange={(date) => {
                                        const newEndMonth = date
                                        const newStartMonth = isSameMonth(date, visibleMonths[0]) ? subMonths(date, 1) : visibleMonths[0]
                                        setVisibleMonths([newStartMonth, newEndMonth])
                                      }}
                                      slots={{ day: CustomDay }}
                                      disableFuture
                                    />
                                </Box>
                            </>
                        )}
                    </Box>
                </Box>

                {/* --- FOOTER: Action Buttons (Fixed) --- */}
                <Divider />
                <Stack direction="row" justifyContent="flex-end" spacing={2} sx={{ p: 2 }}>
                    <Button onClick={onClose}>Cancel</Button>
                    <Button onClick={handleApply} variant="contained" disabled={!start || !end}>Apply</Button>
                </Stack>
            </Stack>
          </LocalizationProvider>
    </Menu>
  )
}
