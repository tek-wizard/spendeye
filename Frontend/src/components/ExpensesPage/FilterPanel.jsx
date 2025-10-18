import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, Divider, Button, Paper } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';

// Import the filter views
import { FilterMainView } from './FilterViews/FilterMainView';
import { FilterCategoryView } from './FilterViews/FilterCategoryView';

// Animation variants for the sliding panels
const variants = {
    enter: (direction) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
};

export const FilterPanel = React.memo(({ onApply, onReset, ...props }) => {
    const [view, setView] = useState({ current: 'main', direction: 1 });

    const handleNavigate = (targetView) => setView({ current: targetView, direction: 1 });
    const handleBack = () => setView({ current: 'main', direction: -1 });

    const viewTitles = {
        main: 'Filters',
        category: 'Select Category',
        // Add other titles as you create more views
    };

    return (
        <Paper variant="outlined" sx={{ width: 360, borderRadius: 4, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" sx={{ p: 1, flexShrink: 0 }}>
                {view.current !== 'main' && (
                    <IconButton onClick={handleBack} size="small" sx={{ mr: 1 }}>
                        <ArrowBackIosNewIcon fontSize="inherit" />
                    </IconButton>
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: view.current === 'main' ? 'left' : 'center' }}>
                    {viewTitles[view.current]}
                </Typography>
                <IconButton onClick={onApply} sx={{ ml: 1 }}><CloseIcon /></IconButton>
            </Stack>
            <Divider />

            {/* Animated Content Area */}
            <Box sx={{ position: 'relative', overflow: 'hidden', p: 2 }}>
                <AnimatePresence initial={false} custom={view.direction}>
                    <motion.div
                        key={view.current}
                        custom={view.direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
                    >
                        {view.current === 'main' && <FilterMainView onNavigate={handleNavigate} {...props} />}
                        {view.current === 'category' && <FilterCategoryView onCategoryChange={props.onCategoryChange} selectedCategories={props.filters.selectedCategories} />}
                        {/* Other views will go here */}
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* Footer */}
            <Stack direction="row" spacing={2} sx={{ p: 2, mt: 'auto', borderTop: 1, borderColor: 'divider' }}>
                <Button fullWidth variant="outlined" onClick={onReset}>Reset All</Button>
                <Button fullWidth variant="contained" onClick={onApply}>Apply</Button>
            </Stack>
        </Paper>
    );
});