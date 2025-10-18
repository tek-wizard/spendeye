import React, { useState, useMemo } from 'react';
import { Box, Stack, TextField, InputAdornment, FormGroup, FormControlLabel, Checkbox, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useCategoryMaps } from '../../../utils/categoryMaps';

export const FilterCategoryView = ({ selectedCategories, onCategoryChange }) => {
    const { categoryColors } = useCategoryMaps();
    const allCategories = Object.keys(categoryColors);
    const [search, setSearch] = useState('');

    const filteredCategories = useMemo(() => 
        allCategories.filter(cat => cat.toLowerCase().includes(search.toLowerCase())),
        [search, allCategories]
    );

    const handleToggle = (category) => {
        const currentIndex = selectedCategories.indexOf(category);
        const newCategories = [...selectedCategories];
        if (currentIndex === -1) {
            newCategories.push(category);
        } else {
            newCategories.splice(currentIndex, 1);
        }
        onCategoryChange(newCategories);
    };
    
    return (
        <Stack spacing={2}>
            <TextField
                variant="standard"
                placeholder="Search categories..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                    startAdornment: (<InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>),
                    disableUnderline: true,
                }}
                sx={{ bgcolor: 'action.hover', borderRadius: 1.5, p: '4px 8px' }}
            />
            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                <FormGroup>
                    {filteredCategories.map(cat => (
                        <FormControlLabel
                            key={cat}
                            control={<Checkbox checked={selectedCategories.includes(cat)} onChange={() => handleToggle(cat)} />}
                            label={cat}
                        />
                    ))}
                </FormGroup>
                 {filteredCategories.length === 0 && <Typography color="text.secondary" sx={{p: 2, textAlign: 'center'}}>No categories found</Typography>}
            </Box>
        </Stack>
    );
};