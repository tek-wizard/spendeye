import React, { useMemo } from 'react';
import { Skeleton } from '@mui/material';
import { useCategoryMaps } from '../../utils/categoryMaps.jsx';
import { SpendingChartView } from './SpendingChartView.jsx';

export const SpendingChartContainer = ({ spendingData, totalSpending, onCategoryClick, isLoading }) => {
  const { categoryColors } = useCategoryMaps();

  // This memo's only job is to add the theme colors to the data from the API.
  const dataWithColors = useMemo(() => {
    if (!spendingData) return [];
    return spendingData.map(item => ({
      ...item,
      color: categoryColors[item.name] || '#9E9E9E'
    }));
  }, [spendingData, categoryColors]);

  if (isLoading) {
    return <Skeleton variant="rounded" sx={{ bgcolor: "grey.900" }} height={450} />;
  }

  return (
    <SpendingChartView
      data={dataWithColors}
      total={totalSpending}
      onCategoryClick={onCategoryClick}
    />
  );
};