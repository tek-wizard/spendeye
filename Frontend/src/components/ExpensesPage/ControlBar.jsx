import React from 'react';
import { Paper, TextField, IconButton, InputAdornment, Tooltip, Badge, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import { DateRangeSelector } from './DateRangeSelector';

export const ControlBar = React.memo(({
  dateRange,
  setDateRange,
  searchTerm,
  onSearchChange,
  onFilterClick,
  activeFilterCount
}) => {
  return (
    <Paper
      variant="outlined"
      sx={{
        p: 1.5,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        borderRadius: 2,
        mb: 3
      }}
    >
      <DateRangeSelector dateRange={dateRange} setDateRange={setDateRange} />
      
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search in notes..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon fontSize="small" />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        sx={{ pl: 1 }}
      />
      
      <Tooltip title="Advanced Filters">
        <IconButton onClick={onFilterClick}>
            <Badge badgeContent={activeFilterCount} color="primary">
              <TuneIcon />
            </Badge>
        </IconButton>
      </Tooltip>
    </Paper>
  );
});