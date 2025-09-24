import React from 'react';
import { Skeleton } from '@mui/material';
import { MonthlySummaryView } from './MonthlySummaryView';

// This is the final, "dumber" container.
// It expects to receive the final, pre-calculated `summaryData` object.
export const MonthlySummaryContainer = ({ summaryData, isLoading }) => {
  // Its only jobs are to handle the loading state...
  if (isLoading || !summaryData) {
    return <Skeleton variant="rounded" sx={{ bgcolor: "grey.900" }} height={210} />;
  }

  // ...and pass the final data to the display component.
  return <MonthlySummaryView data={summaryData} />;
};