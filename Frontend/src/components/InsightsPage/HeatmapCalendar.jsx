import React, { useState, useMemo, useRef } from "react"
import {
  Paper,
  Typography,
  Box,
  Stack,
  Skeleton,
  Tooltip,
  useTheme,
  alpha,
  useMediaQuery,
} from "@mui/material"
import {
  getDaysInMonth,
  startOfMonth,
  format,
  getDate,
  isToday as checkIsToday,
} from "date-fns"
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined"

const DayCell = ({ day, amount, color, isToday, isMobile, theme }) => {
  const [open, setOpen] = useState(false)
  const timerRef = useRef()

  const handleTooltipToggle = () => {
    if (isMobile) {
      clearTimeout(timerRef.current)
      setOpen((prev) => !prev)
      // Automatically close the tooltip after a few seconds
      timerRef.current = setTimeout(() => {
        setOpen(false)
      }, 1500)
    }
  }

  const handleTooltipClose = () => {
    clearTimeout(timerRef.current)
    setOpen(false)
  }

  const formatValue = (value) => {
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`
    return value
  }

  const displayAmount = !isMobile && amount > 0 ? formatValue(amount) : null

  return (
    <Tooltip
      title={
        <Typography sx={{ fontSize: "0.9rem", fontWeight: 500 }}>
          {amount > 0
            ? `${amount.toLocaleString("en-IN", {
                style: "currency",
                currency: "INR",
              })}`
            : "No spending"}
        </Typography>
      }
      arrow
      placement="top"
      open={isMobile ? open : undefined}
      onClose={handleTooltipClose}
      disableHoverListener={isMobile}
      disableFocusListener={isMobile}
      disableTouchListener={isMobile}
      componentsProps={{
        tooltip: {
          sx: {
            bgcolor: "background.paper",
            color: "text.primary",
            boxShadow: 3,
            px: 2,
            py: 1,
            fontSize: "0.9rem",
            borderRadius: 1.5,
          },
        },
        arrow: {
          sx: {
            color: "background.paper",
          },
        },
      }}
    >
      <Box
        onClick={handleTooltipToggle}
        sx={{
          width: "100%",
          paddingTop: "100%",
          position: "relative",
          bgcolor: color,
          borderRadius: 1.5,
          cursor: "pointer",
          transition: "transform 0.15s ease-in-out",
          border: isToday
            ? `2px solid ${alpha(theme.palette.primary.contrastText, 0.8)}`
            : "none",
          boxSizing: "border-box",
          "&:hover": {
            transform: "scale(1.1)",
            zIndex: 1,
            boxShadow: (theme) => theme.shadows[6],
          },
        }}
      >
        {/* Day number */}
        <Typography
          sx={{
            position: "absolute",
            top: 4,
            left: 4,
            fontSize: "0.7rem",
            fontWeight: "medium",
            color: amount > 0 ? "text.primary" : "text.disabled",
          }}
        >
          {day}
        </Typography>

        {/* Amount display (desktop only) */}
        {displayAmount && (
          <Typography
            sx={{
              position: "absolute",
              bottom: 4,
              right: 4,
              fontSize: "0.7rem",
              fontWeight: "bold",
              color: "text.primary",
              opacity: 0.7,
            }}
          >
            {displayAmount}
          </Typography>
        )}
      </Box>
    </Tooltip>
  )
}

export const HeatmapCalendar = ({ data, isLoading, month }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const calendarData = useMemo(() => {
    if (!data || !month) return { days: [], maxAmount: 1 }

    const daysInMonth = getDaysInMonth(month)
    const firstDayOfMonth = startOfMonth(month)
    const startingDayOfWeek = firstDayOfMonth.getDay()

    const maxAmount = Math.max(...data.map((d) => d.amount), 1)
    const spendingMap = new Map(
      data.map((d) => [getDate(new Date(d.date)), d.amount])
    )

    let days = Array.from({ length: startingDayOfWeek }, () => null)
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, amount: spendingMap.get(i) || 0 })
    }

    return { days, maxAmount }
  }, [data, month])

  const getColorForAmount = (amount) => {
    if (amount === 0) return theme.palette.action.hover
    const intensity =
      Math.log(amount + 1) / Math.log(calendarData.maxAmount + 1)

    if (intensity < 0.25) return alpha(theme.palette.primary.main, 0.15)
    if (intensity < 0.5) return alpha(theme.palette.primary.main, 0.4)
    if (intensity < 0.75) return alpha(theme.palette.primary.main, 0.7)
    return theme.palette.primary.main
  }

  if (isLoading) {
    return <Skeleton variant="rounded" height={350} />
  }

  return (
    <Paper variant="outlined" sx={{ borderRadius: 2, p: 2.5, height: "100%" }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
        Daily Spending Heatmap
      </Typography>

      {!data || data.length === 0 ? (
        <Stack
          sx={{
            height: "80%",
            alignItems: "center",
            justifyContent: "center",
            color: "text.secondary",
          }}
        >
          <CalendarMonthOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
          <Typography>No spending data for this month.</Typography>
        </Stack>
      ) : (
        <Stack spacing={1}>
          {/* Weekday headers */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
              mb: 1,
            }}
          >
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <Typography
                key={day}
                variant="caption"
                sx={{ textAlign: "center", color: "text.secondary" }}
              >
                {day}
              </Typography>
            ))}
          </Box>

          {/* Calendar grid */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: 1,
            }}
          >
            {calendarData.days.map((dayData, index) =>
              dayData ? (
                <DayCell
                  key={index}
                  day={dayData.day}
                  amount={dayData.amount}
                  color={getColorForAmount(dayData.amount)}
                  isToday={checkIsToday(
                    new Date(month.getFullYear(), month.getMonth(), dayData.day)
                  )}
                  isMobile={isMobile}
                  theme={theme}
                />
              ) : (
                <Box key={`empty-${index}`} />
              )
            )}
          </Box>
        </Stack>
      )}
    </Paper>
  )
}
