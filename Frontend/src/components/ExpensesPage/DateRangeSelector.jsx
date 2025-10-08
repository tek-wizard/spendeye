import React, { useState } from 'react';
import { Button, Menu, MenuItem, ListItemIcon, Divider, Dialog, DialogTitle, DialogContent, DialogActions, useTheme } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EventIcon from '@mui/icons-material/Event';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { startOfMonth, endOfMonth, subMonths, startOfYear, endOfYear, format } from 'date-fns';

export const DateRangeSelector = React.memo(({ dateRange, setDateRange }) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = useState(null);
    const [isCustomModalOpen, setCustomModalOpen] = useState(false);
    const [customRange, setCustomRange] = useState([
      {
        startDate: dateRange.startDate,
        endDate: dateRange.endDate,
        key: 'selection',
      },
    ]);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleSelect = (label, startDate, endDate) => {
    setDateRange({ label, startDate, endDate });
    handleClose();
  };

  const handleCustomApply = () => {
    const { startDate, endDate } = customRange[0];
    const formattedLabel = format(startDate, 'MMM d, yyyy') === format(endDate, 'MMM d, yyyy')
      ? format(startDate, 'MMM d, yyyy')
      : `${format(startDate, 'MMM d')} - ${format(endDate, 'MMM d, yyyy')}`;
      
    setDateRange({ label: formattedLabel, startDate, endDate });
    setCustomModalOpen(false);
    handleClose();
  };

  const now = new Date();
  const presets = [
    { label: 'This Month', startDate: startOfMonth(now), endDate: endOfMonth(now), icon: <CalendarTodayIcon fontSize="small"/> },
    { label: 'Last Month', startDate: startOfMonth(subMonths(now, 1)), endDate: endOfMonth(subMonths(now, 1)), icon: <EventIcon fontSize="small"/> },
    { label: 'This Year', startDate: startOfYear(now), endDate: endOfYear(now), icon: <DateRangeIcon fontSize="small"/> },
    { label: 'All Time', startDate: new Date('1970-01-01'), endDate: now, icon: <AllInclusiveIcon fontSize="small"/> },
  ];
  
  // Theme overrides to make the date picker match your app's dark theme
  const datePickerTheme = {
    '.rdrCalendarWrapper': {
      backgroundColor: theme.palette.background.paper,
      color: theme.palette.text.primary,
    },
    '.rdrMonth': {
      backgroundColor: theme.palette.background.paper,
    },
    '.rdrDayNumber span': {
      color: theme.palette.text.primary,
    },
    '.rdrDayPassive .rdrDayNumber span': {
      color: theme.palette.text.disabled,
    },
    '.rdrDayToday .rdrDayNumber span:after': {
      background: theme.palette.primary.main,
    },
    '.rdrSelected, .rdrInRange, .rdrStartEdge, .rdrEndEdge': {
      backgroundColor: theme.palette.primary.light,
    },
    '.rdrDateDisplayWrapper': {
      backgroundColor: 'transparent',
    },
    '.rdrDateDisplayItem': {
      backgroundColor: theme.palette.background.default,
      border: '1px solid',
      borderColor: theme.palette.divider,
    },
    '.rdrMonthAndYearWrapper': {
      backgroundColor: theme.palette.background.paper,
    },
    '.rdrNextPrevButton': {
        background: theme.palette.action.hover,
    },
    '.rdrPprevButton i, .rdrNextButton i': {
        borderColor: theme.palette.text.primary,
    },
  };

  return (
    <>
      <Button
        variant="outlined"
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        sx={{ textTransform: 'none', alignSelf: 'flex-start' }}
      >
        {dateRange.label}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              bgcolor: 'background.paper',
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                left: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
        }}
        transformOrigin={{ horizontal: 'left', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
      >
        {presets.map(p => (
          <MenuItem key={p.label} onClick={() => handleSelect(p.label, p.startDate, p.endDate)}>
            <ListItemIcon>{p.icon}</ListItemIcon>
            {p.label}
          </MenuItem>
        ))}
        <Divider />
        <MenuItem onClick={() => { handleClose(); setCustomModalOpen(true); }}>
          <ListItemIcon><DateRangeIcon fontSize="small"/></ListItemIcon>
          Custom Range
        </MenuItem>
      </Menu>

      <Dialog open={isCustomModalOpen} onClose={() => setCustomModalOpen(false)} PaperProps={{ sx: datePickerTheme }}>
        <DialogTitle>Select Custom Date Range</DialogTitle>
        <DialogContent sx={{ p: { xs: 0, sm: '0 24px' } }}>
          <DateRangePicker
            onChange={item => setCustomRange([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={customRange}
            direction="horizontal"
            rangeColors={[theme.palette.primary.main]}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCustomModalOpen(false)}>Cancel</Button>
          <Button onClick={handleCustomApply} variant="contained">Apply</Button>
        </DialogActions>
      </Dialog>
    </>
  );
});