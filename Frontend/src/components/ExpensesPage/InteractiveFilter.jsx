import React, { useState } from 'react';
import { Box, Typography, IconButton, Stack, Divider, Button } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import CloseIcon from '@mui/icons-material/Close';

// Import the new views
import { FilterMainView } from './FilterViews/FilterMainView';
import { FilterCategoryView } from './FilterViews/FilterCategoryView';

const variants = {
    enter: (direction) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0
    }),
    center: {
        x: 0,
        opacity: 1
    },
    exit: (direction) => ({
        x: direction < 0 ? '100%' : '-100%',
        opacity: 0
    }),
};

export const InteractiveFilter = ({ onApply, onReset, ...props }) => {
    const [view, setView] = useState({ current: 'main', direction: 1 });

    const handleNavigate = (targetView) => {
        setView({ current: targetView, direction: 1 });
    };

    const handleBack = () => {
        setView({ current: 'main', direction: -1 });
    };

    const viewTitles = {
        main: 'Filters',
        category: 'Select Category',
        amount: 'Select Amount',
        type: 'Select Type',
        date: 'Select Date Range',
    };

    return (
        <Stack sx={{ height: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" sx={{ p: 1, flexShrink: 0 }}>
                {view.current !== 'main' && (
                    <IconButton onClick={handleBack} size="small">
                        <ArrowBackIosNewIcon fontSize="inherit" />
                    </IconButton>
                )}
                <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1, textAlign: view.current === 'main' ? 'left' : 'center' }}>
                    {viewTitles[view.current]}
                </Typography>
                <IconButton onClick={onApply}><CloseIcon /></IconButton>
            </Stack>
            <Divider sx={{ mb: 1 }}/>

            {/* Animated Content Area */}
            <Box sx={{ position: 'relative', flexGrow: 1, p: 1 }}>
                <AnimatePresence initial={false} custom={view.direction}>
                    <motion.div
                        key={view.current}
                        custom={view.direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ type: 'tween', ease: 'easeInOut', duration: 0.25 }}
                        style={{ position: 'absolute', width: '100%', height: '100%' }}
                    >
                        {view.current === 'main' && <FilterMainView onNavigate={handleNavigate} {...props} />}
                        {view.current === 'category' && <FilterCategoryView onCategoryChange={props.onCategoryChange} selectedCategories={props.filters.selectedCategories} />}
                        {/* We'll add the other views (Amount, Type, Date) here following the same pattern */}
                    </motion.div>
                </AnimatePresence>
            </Box>

            {/* Footer */}
            <Stack direction="row" spacing={2} sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
                <Button fullWidth variant="outlined" onClick={onReset}>Reset All</Button>
                <Button fullWidth variant="contained" onClick={onApply}>Apply</Button>
            </Stack>
        </Stack>
    );
};