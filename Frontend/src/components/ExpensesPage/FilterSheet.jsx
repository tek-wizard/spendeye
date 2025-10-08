import React, { useState } from 'react';
import { Drawer, Box, Typography, IconButton, Stack, FormGroup, FormControlLabel, Checkbox, Slider, Button, ToggleButtonGroup, ToggleButton, Divider, Menu, MenuItem, ListItemIcon, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useCategoryMaps } from '../../utils/categoryMaps';
import { DateRangePicker } from 'react-date-range';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, format } from 'date-fns';

export const FilterSheet = React.memo(({ isOpen, onClose, filters, onCategoryChange, onAmountChange, onSplitChange, onApply, onReset, dateRange, setDateRange }) => {
  const theme = useTheme();
  const { categoryColors } = useCategoryMaps();
  const allCategories = Object.keys(categoryColors);
  
  // --- STATE FOR DATE PICKER MENU/MODAL ---
  const [anchorEl, setAnchorEl] = useState(null);
  const [isCustomModalOpen, setCustomModalOpen] = useState(false);
  const [customRange, setCustomRange] = useState([{ startDate: dateRange.startDate, endDate: dateRange.endDate, key: 'selection' }]);
  
  // --- DATE PICKER HANDLERS ---
  const handleDateMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleDateMenuClose = () => setAnchorEl(null);
  const handleDatePresetSelect = (label, startDate, endDate) => { setDateRange({ label, startDate, endDate }); handleDateMenuClose(); };
  const handleCustomDateApply = () => {
    const { startDate, endDate } = customRange[0];
    const formattedLabel = format(startDate, 'MMM d, yyyy') === format(endDate, 'MMM d, yyyy')
      ? format(startDate, 'MMM d, yyyy')
      : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
    setDateRange({ label: formattedLabel, startDate, endDate });
    setCustomModalOpen(false);
    handleDateMenuClose();
  };
  const now = new Date();
  const presets = [
    { label: 'This Month', startDate: startOfMonth(now), endDate: endOfMonth(now), icon: <CalendarTodayIcon fontSize="small"/> },
    { label: 'Last Month', startDate: startOfMonth(subMonths(now, 1)), endDate: endOfMonth(subMonths(now, 1)), icon: <EventIcon fontSize="small"/> },
    { label: 'This Year', startDate: startOfYear(now), endDate: endOfYear(now), icon: <DateRangeIcon fontSize="small"/> },
    { label: 'All Time', startDate: new Date('1970-01-01'), endDate: now, icon: <AllInclusiveIcon fontSize="small"/> },
  ];
  const datePickerTheme = {
    '.rdrCalendarWrapper': { backgroundColor: theme.palette.background.paper, color: theme.palette.text.primary, border: 'none' },
    '.rdrMonth': { backgroundColor: theme.palette.background.paper },
    '.rdrDayNumber span': { color: theme.palette.text.primary },
    '.rdrDayPassive .rdrDayNumber span': { color: theme.palette.text.disabled },
    '.rdrDayToday .rdrDayNumber span:after': { background: theme.palette.primary.main },
    '.rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge': { backgroundColor: theme.palette.primary.light },
    '.rdrDateDisplayWrapper': { backgroundColor: 'transparent' },
    '.rdrDateDisplayItem': { backgroundColor: theme.palette.background.default, boxShadow: 'none', borderColor: theme.palette.divider },
    '.rdrMonthAndYearWrapper': { backgroundColor: theme.palette.background.paper, borderBottom: '1px solid', borderColor: theme.palette.divider },
    '.rdrNextPrevButton': { background: theme.palette.action.hover },
    '.rdrPprevButton i': { borderColor: { right: theme.palette.text.primary } },
    '.rdrNextButton i': { borderColor: { left: theme.palette.text.primary } },
  };

  // --- OTHER HANDLERS ---
  const handleCategoryToggle = (category) => {
    const currentIndex = filters.selectedCategories.indexOf(category);
    const newCategories = [...filters.selectedCategories];
    if (currentIndex === -1) { newCategories.push(category); } 
    else { newCategories.splice(currentIndex, 1); }
    onCategoryChange(newCategories);
  };
  const handleSplitChange = (event, newValue) => {
    if (newValue === 'personal') onSplitChange(false);
    else if (newValue === 'split') onSplitChange(true);
    else onSplitChange(null);
  };
  const splitValue = filters.isSplitFilter === true ? 'split' : filters.isSplitFilter === false ? 'personal' : 'all';
  
  return (
    <>
    <Drawer anchor="bottom" open={isOpen} onClose={onClose} PaperProps={{ sx: { borderTopLeftRadius: 16, borderTopRightRadius: 16 } }}>
      <Box sx={{ p: 2, pb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Filters</Typography>
            <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
        <Divider sx={{ my: 1 }} />

        <Typography sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>Date Range</Typography>
        <Button fullWidth variant="outlined" onClick={handleDateMenuClick} endIcon={<ArrowDropDownIcon />}>{dateRange.label}</Button>
        
        <Typography sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>Type</Typography>
        <ToggleButtonGroup value={splitValue} exclusive onChange={handleSplitChange} fullWidth>
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="personal">Personal</ToggleButton>
            <ToggleButton value="split">Split</ToggleButton>
        </ToggleButtonGroup>

        <Typography sx={{ mt: 2, mb: 1, fontWeight: 'medium' }}>Category</Typography>
        <FormGroup sx={{ display: 'flex', flexDirection: 'row', gap: 1, flexWrap: 'wrap' }}>
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
                                    m: 0.25, // spacing
                                    "& .MuiTypography-root": {
                                      fontSize: "0.8rem",
                                      border: 1,
                                      borderColor: "divider",
                                      borderRadius: 2,
                                      padding: "2px 8px",
                                      cursor: "pointer",
                                      bgcolor: isSelected ? "primary.main" : "transparent",
                                      color: isSelected
                                        ? "primary.contrastText"
                                        : "text.primary",
                                      "&:hover": {
                                        bgcolor: isSelected
                                          ? "primary.main"
                                          : "action.hover", // selected stays the same
                                        opacity: isSelected ? 0.9 : 1, // slight opacity for hover on selected
                                      },
                                    },
                                  }}
                                />
                              )
                            })}
        </FormGroup>
        
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography sx={{ fontWeight: 'medium' }}>Amount Range</Typography>
          <Typography variant="body2" color="text.secondary">₹{filters.amountRange[0]} - ₹{filters.amountRange[1]}</Typography>
        </Stack>
        <Slider value={filters.amountRange} onChange={(e, newValue) => onAmountChange(newValue)} valueLabelDisplay="auto" min={0} max={50000} step={500} />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          <Button fullWidth variant="outlined" size="large" onClick={onReset}>Reset</Button>
          <Button fullWidth variant="contained" size="large" onClick={onApply}>Apply Filters</Button>
        </Stack>
      </Box>
    </Drawer>

    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleDateMenuClose} PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible', filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))', mt: 1.5, bgcolor: 'background.paper',
              '&::before': {
                content: '""', display: 'block', position: 'absolute', top: 0, left: 14, width: 10, height: 10,
                bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)', zIndex: 0,
              },
            },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
          {presets.map(p => (<MenuItem key={p.label} onClick={() => handleDatePresetSelect(p.label, p.startDate, p.endDate)}><ListItemIcon>{p.icon}</ListItemIcon>{p.label}</MenuItem>))}
          <Divider />
          <MenuItem onClick={() => { handleDateMenuClose(); setCustomModalOpen(true); }}><ListItemIcon><DateRangeIcon fontSize="small"/></ListItemIcon>Custom Range</MenuItem>
    </Menu>
    <Dialog open={isCustomModalOpen} onClose={() => setCustomModalOpen(false)} PaperProps={{ sx: datePickerTheme }}>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent sx={{ p: { xs: 0, sm: '0 24px' } }}><DateRangePicker onChange={item => setCustomRange([item.selection])} showSelectionPreview={true} moveRangeOnFirstSelection={false} months={2} ranges={customRange} direction="horizontal" rangeColors={[theme.palette.primary.main]} /></DialogContent>
        <DialogActions><Button onClick={() => setCustomModalOpen(false)}>Cancel</Button><Button onClick={handleCustomDateApply} variant="contained">Apply</Button></DialogActions>
    </Dialog>
    </>
  );
});