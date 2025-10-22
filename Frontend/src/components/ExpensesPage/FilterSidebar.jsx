import React, { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Stack,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Divider,
  Menu,
  MenuItem,
  ListItemIcon,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
} from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useCategoryMaps } from "../../utils/categoryMaps"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import EventIcon from "@mui/icons-material/Event"
import CalendarTodayIcon from "@mui/icons-material/CalendarToday"
import DateRangeIcon from "@mui/icons-material/DateRange"
import AllInclusiveIcon from "@mui/icons-material/AllInclusive"
import {
  startOfMonth,
  endOfMonth,
  subMonths,
  startOfYear,
  endOfYear,
  format,
  isSameDay,
} from "date-fns"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

import { DatePickerMenu } from "./DatePickerMenu"

// --- HELPERS ---
const getCustomPresets = () => {
  try {
    const presets = localStorage.getItem("spendy_amount_presets")
    return presets ? JSON.parse(presets) : []
  } catch (e) {
    return []
  }
}
const formatNumber = (num) =>
  num >= 1000 ? `${(num / 1000).toFixed(1)}k` : num
const generateAmountLabel = (min, max) => {
  if (min === 0 && max >= 50000) return "All"
  if (min === 0) return `Under ₹${formatNumber(max)}`
  if (max >= 50000) return `Over ₹${formatNumber(min)}`
  return `₹${formatNumber(min)} - ₹${formatNumber(max)}`
}

// --- VALIDATION SCHEMA for the custom amount modal ---
const amountPresetSchema = z
  .object({
    min: z.number().min(0, "Cannot be negative"),
    max: z.number().positive("Must be greater than 0"),
  })
  .refine((data) => data.max > data.min, {
    message: "Max amount must be greater than Min",
    path: ["max"], // Assign error to the 'max' field
  })

// --- MAIN COMPONENT ---
export const FilterSidebar = React.memo(
  ({
    filters,
    onCategoryChange,
    onAmountChange,
    onSplitChange,
    onApply,
    onReset,
    dateRange,
    setDateRange,
  }) => {
    const theme = useTheme()
    const { categoryColors } = useCategoryMaps()
    const allCategories = Object.keys(categoryColors)

    const [expandedPanel, setExpandedPanel] = useState(false)
    const handleAccordionChange = (panel) => (event, isExpanded) => {
      setExpandedPanel(isExpanded ? panel : false)
    }

    // ---  THE NEW MUI DATE PICKER ---
    const [dateAnchorEl, setDateAnchorEl] = useState(null)
    const handleDateMenuClick = (event) => setDateAnchorEl(event.currentTarget)
    const handleDateMenuClose = () => setDateAnchorEl(null)

    // --- STATE & LOGIC FOR CUSTOM AMOUNT PRESETS ---
    const [isAmountModalOpen, setAmountModalOpen] = useState(false)
    const [customPresets, setCustomPresets] = useState(getCustomPresets)
    const {
      register,
      handleSubmit,
      formState: { errors },
      setValue,
      watch,
      reset: resetAmountForm,
    } = useForm({
      resolver: zodResolver(amountPresetSchema),
      defaultValues: { min: 0, max: 10000 },
    })
    const newPresetWatchedRange = watch()

    useEffect(() => {
      localStorage.setItem(
        "spendy_amount_presets",
        JSON.stringify(customPresets)
      )
    }, [customPresets])

    const onSaveCustomPreset = (data) => {
      const { min, max } = data
      const newLabel = generateAmountLabel(min, max)
      const newPreset = { label: newLabel, range: [min, max] }

      const allCurrentPresets = [...defaultPresets, ...customPresets]
      const isDuplicate = allCurrentPresets.some(
        (p) => p.label === newPreset.label
      )
      if (isDuplicate) {
        toast.error("This preset already exists.")
        return
      }

      setCustomPresets((prev) => [...prev, newPreset])
      onAmountChange(newPreset.range)
      setAmountModalOpen(false)
    }

    const handleDeleteCustomPreset = (presetToDelete) => {
      setCustomPresets((prev) =>
        prev.filter((p) => p.label !== presetToDelete.label)
      )
    }

    // --- OTHER FILTER HANDLERS ---
    const handleCategoryToggle = (category) => {
      const currentIndex = filters.selectedCategories.indexOf(category)
      const newCategories = [...filters.selectedCategories]
      if (currentIndex === -1) {
        newCategories.push(category)
      } else {
        newCategories.splice(currentIndex, 1)
      }
      onCategoryChange(newCategories)
    }
    const handleSplitChange = (event, newValue) => {
      if (newValue === "personal") onSplitChange(false)
      else if (newValue === "split") onSplitChange(true)
      else onSplitChange(null)
    }

    // --- Data for Rendering ---
    const now = new Date()
    const datePresets = [
      {
        label: "This Month",
        startDate: startOfMonth(now),
        endDate: endOfMonth(now),
        icon: <CalendarTodayIcon fontSize="small" />,
      },
      {
        label: "Last Month",
        startDate: startOfMonth(subMonths(now, 1)),
        endDate: endOfMonth(subMonths(now, 1)),
        icon: <EventIcon fontSize="small" />,
      },
      {
        label: "This Year",
        startDate: startOfYear(now),
        endDate: endOfYear(now),
        icon: <DateRangeIcon fontSize="small" />,
      },
      {
        label: "All Time",
        startDate: new Date("1970-01-01"),
        endDate: now,
        icon: <AllInclusiveIcon fontSize="small" />,
      },
    ]
    const datePickerTheme = {
      ".rdrCalendarWrapper": {
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
        border: "none",
      },
      ".rdrMonth": { backgroundColor: theme.palette.background.paper },
      ".rdrDayNumber span": { color: theme.palette.text.primary },
      ".rdrDayPassive .rdrDayNumber span": {
        color: theme.palette.text.disabled,
      },
      ".rdrDayToday .rdrDayNumber span:after": {
        background: theme.palette.primary.main,
      },
      ".rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge": {
        backgroundColor: theme.palette.primary.light,
      },
      ".rdrDateDisplayWrapper": { backgroundColor: "transparent" },
      ".rdrDateDisplayItem": {
        backgroundColor: theme.palette.background.default,
        boxShadow: "none",
        borderColor: theme.palette.divider,
      },
      ".rdrMonthAndYearWrapper": {
        backgroundColor: theme.palette.background.paper,
        borderBottom: "1px solid",
        borderColor: theme.palette.divider,
      },
      ".rdrNextPrevButton": { background: theme.palette.action.hover },
      ".rdrPprevButton i": {
        borderColor: { right: theme.palette.text.primary },
      },
      ".rdrNextButton i": { borderColor: { left: theme.palette.text.primary } },
    }
    const defaultPresets = [
      { label: "All", range: [0, 50000] },
      { label: "Under ₹1k", range: [0, 1000] },
      { label: "₹1k - ₹5k", range: [1000, 5000] },
      { label: "Over ₹5k", range: [5000, 50000] },
    ]
    const allPresets = [...defaultPresets, ...customPresets]
    const splitValue =
      filters.isSplitFilter === true
        ? "split"
        : filters.isSplitFilter === false
        ? "personal"
        : "all"
    const dateValue = dateRange.label
    const categoryValue =
      filters.selectedCategories.length > 0
        ? `${filters.selectedCategories.length} selected`
        : "All"
    const amountValue =
      filters.amountRange[0] > 0 || filters.amountRange[1] < 50000
        ? `₹${formatNumber(filters.amountRange[0])} - ₹${formatNumber(
            filters.amountRange[1]
          )}`
        : "All"
    const typeValue =
      filters.isSplitFilter === true
        ? "Split"
        : filters.isSplitFilter === false
        ? "Personal"
        : "All"
    const numberInputSx = {
      "& input[type=number]::-webkit-inner-spin-button, & input[type=number]::-webkit-outer-spin-button":
        { WebkitAppearance: "none", margin: 0 },
      "& input[type=number]": { MozAppearance: "textfield" },
    }

        return (
      <>
        <Paper
          variant="outlined"
          sx={{ 
            width: '100%', 
            maxWidth: 380,
            borderRadius: 4, 
            overflow: "hidden" 
          }}
        >
          <Stack
            sx={{
              p: 2.5,
              height: "100%",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Filters
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ flexGrow: 1, overflowY: "auto", pr: 1, mr: -1 }}>
              <Accordion
                expanded={expandedPanel === "date"}
                onChange={handleAccordionChange("date")}
                sx={{ bgcolor: "transparent", boxShadow: "none", "&:before": { display: "none" } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "medium", flexShrink: 0 }}>Date Range</Typography>
                  <Typography sx={{ color: "text.secondary", ml: "auto", mr: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dateValue}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Button fullWidth variant="outlined" onClick={handleDateMenuClick}>{dateRange.label}</Button>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedPanel === "category"}
                onChange={handleAccordionChange("category")}
                sx={{ bgcolor: "transparent", boxShadow: "none", "&:before": { display: "none" } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "medium" }}>Category</Typography>
                  <Typography sx={{ color: "text.secondary", ml: "auto", mr: 1 }}>{categoryValue}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <FormGroup
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      gap: 1,
                      flexWrap: "wrap",
                    }}
                  >
                    {allCategories.map((cat) => {
                      const isSelected = filters.selectedCategories.includes(cat)
                      return (
                        <FormControlLabel
                          key={cat}
                          control={
                            <Checkbox
                              checked={isSelected}
                              onChange={() => handleCategoryToggle(cat)}
                              sx={{ display: "none" }}
                            />
                          }
                          label={cat}
                          sx={{
                            m: 0,
                            "& .MuiTypography-root": {
                              border: 1,
                              borderColor: "divider",
                              borderRadius: 4,
                              padding: "4px 12px",
                              cursor: "pointer",
                              "&:hover": !isSelected ? { bgcolor: "action.hover" } : {},
                              ...(isSelected && {
                                bgcolor: "primary.main",
                                color: "primary.contrastText",
                                borderColor: "primary.main",
                              }),
                            },
                          }}
                        />
                      )
                    })}
                  </FormGroup>
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedPanel === "amount"}
                onChange={handleAccordionChange("amount")}
                sx={{ bgcolor: "transparent", boxShadow: "none", "&:before": { display: "none" } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "medium" }}>Amount</Typography>
                  <Typography sx={{ color: "text.secondary", ml: "auto", mr: 1 }}>{amountValue}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 3 }}>
                    {allPresets.map((preset) => {
                      const isCustom = defaultPresets.findIndex(p => p.label === preset.label) === -1
                      const isSelected = JSON.stringify(filters.amountRange) === JSON.stringify(preset.range)
                      return (
                        <Chip
                          key={preset.label}
                          label={preset.label}
                          onClick={() => onAmountChange(preset.range)}
                          variant={isSelected ? "filled" : "outlined"}
                          color="primary"
                          onDelete={isCustom ? () => handleDeleteCustomPreset(preset) : undefined}
                        />
                      )
                    })}
                    <Tooltip title={customPresets.length >= 5 ? "Maximum of 5 custom presets reached" : ""}>
                      <span>
                        <Chip
                          label="Custom"
                          icon={<AddCircleOutlineIcon />}
                          onClick={() => {
                            resetAmountForm({
                              min: filters.amountRange[0],
                              max: filters.amountRange[1],
                            })
                            setAmountModalOpen(true)
                          }}
                          variant="outlined"
                          disabled={customPresets.length >= 5}
                        />
                      </span>
                    </Tooltip>
                  </Box>
                  <Slider
                    value={filters.amountRange}
                    onChange={(e, newValue) => onAmountChange(newValue)}
                    valueLabelDisplay="auto"
                    min={0}
                    max={50000}
                    step={500}
                    marks={[{ value: 10000, label: "10k" }, { value: 25000, label: "25k" }]}
                  />
                </AccordionDetails>
              </Accordion>

              <Accordion
                expanded={expandedPanel === "type"}
                onChange={handleAccordionChange("type")}
                sx={{ bgcolor: "transparent", boxShadow: "none", "&:before": { display: "none" } }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography sx={{ fontWeight: "medium" }}>Type</Typography>
                  <Typography sx={{ color: "text.secondary", ml: "auto", mr: 1 }}>{typeValue}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <ToggleButtonGroup
                    value={splitValue}
                    exclusive
                    onChange={handleSplitChange}
                    fullWidth
                    size="small"
                  >
                    <ToggleButton value="all">All</ToggleButton>
                    <ToggleButton value="personal">Personal</ToggleButton>
                    <ToggleButton value="split">Split</ToggleButton>
                  </ToggleButtonGroup>
                </AccordionDetails>
              </Accordion>
            </Box>

            <Stack direction="row" spacing={2} sx={{ pt: 2, mt: "auto" }}>
              <Button fullWidth variant="outlined" onClick={onReset}>Reset</Button>
              <Button fullWidth variant="contained" onClick={onApply}>Apply</Button>
            </Stack>
          </Stack>
        </Paper>

        <Dialog open={isAmountModalOpen} onClose={() => setAmountModalOpen(false)} maxWidth="xs" fullWidth>
          <DialogTitle sx={{ fontWeight: "bold" }}>Create Custom Range</DialogTitle>
          <form onSubmit={handleSubmit(onSaveCustomPreset)}>
            <DialogContent>
              <Stack spacing={2.5} sx={{ pt: 1 }}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: "center" }}>
                  <Typography variant="caption" color="text.secondary">PRESET PREVIEW</Typography>
                  <Typography sx={{ fontWeight: "bold" }}>
                    {generateAmountLabel(newPresetWatchedRange.min, newPresetWatchedRange.max)}
                  </Typography>
                </Paper>
                <Slider
                  value={[newPresetWatchedRange.min, newPresetWatchedRange.max]}
                  onChange={(e, newValue) => {
                    setValue("min", newValue[0])
                    setValue("max", newValue[1])
                  }}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000}
                  step={500}
                />
                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Min Amount"
                    type="number"
                    {...register("min", { valueAsNumber: true })}
                    error={!!errors.min}
                    helperText={errors.min?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    sx={numberInputSx}
                  />
                  <TextField
                    label="Max Amount"
                    type="number"
                    {...register("max", { valueAsNumber: true })}
                    error={!!errors.max}
                    helperText={errors.max?.message}
                    InputProps={{ startAdornment: <InputAdornment position="start">₹</InputAdornment> }}
                    sx={numberInputSx}
                  />
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button onClick={() => setAmountModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Save Preset</Button>
            </DialogActions>
          </form>
        </Dialog>

        <DatePickerMenu anchorEl={dateAnchorEl} onClose={handleDateMenuClose} dateRange={dateRange} setDateRange={setDateRange} />
      </>
    )

  }
)
