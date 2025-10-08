import React from 'react';
import { Paper, TextField, IconButton, InputAdornment, Tooltip, Badge } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';

export const ExpenseFilterBar = React.memo(({ searchTerm, onSearchChange, onFilterClick, activeFilterCount }) => {
  return (
    <Paper variant="outlined" sx={{ p: 0.5, display: 'flex', alignItems: 'center', gap: 1, borderRadius: 2 }}>
      <TextField
        fullWidth
        variant="standard"
        placeholder="Search transactions..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="disabled" />
            </InputAdornment>
          ),
          disableUnderline: true,
        }}
        sx={{ pl: 1 }}
      />
      <Tooltip title="Advanced Filters">
        <IconButton onClick={onFilterClick}>
            <Badge badgeContent={activeFilterCount} color="primary" variant="dot">
              <TuneIcon />
            </Badge>
        </IconButton>
      </Tooltip>
    </Paper>
  );
});