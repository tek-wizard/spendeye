// src/components/SpendingChart.jsx
import React, { useState } from 'react';
import { Box, Typography, Card, CardContent, useTheme, Stack } from '@mui/material';
import { PieChart, Pie, Sector, ResponsiveContainer, Cell, Legend } from 'recharts';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';

// --- Helper Components ---

const RenderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  // This component now ONLY draws the expanded shape, not the text.
  return (
    <Sector
      cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius + 8}
      startAngle={startAngle} endAngle={endAngle} fill={fill} cornerRadius={8}
      style={{ outline: 'none' }}
    />
  );
};

const CustomLegend = ({ payload }) => (
    <Stack direction="row" flexWrap="wrap" justifyContent="center" spacing={2} sx={{ pt: 2 }}>
        {payload.map((entry, index) => (
            <Box key={`item-${index}`} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: entry.color }} />
                <Typography variant="caption" color="text.secondary">{entry.value}</Typography>
            </Box>
        ))}
    </Stack>
);

const NoDataDisplay = () => (
    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', textAlign: 'center', height: 400 }}>
        <ReportProblemOutlinedIcon sx={{ fontSize: 40, mb: 1 }} />
        <Typography>No spending data for this month.</Typography>
    </Box>
);

// --- Main Component ---

export const SpendingChartView = ({ data, total, onCategoryClick }) => {
  const theme = useTheme();
  const [activeIndex, setActiveIndex] = useState(-1);

  const safeData = Array.isArray(data) ? data.filter(item => item && item.name && typeof item.value === 'number') : [];

  const onPieEnter = (_, index) => setActiveIndex(index);
  const onPieLeave = () => setActiveIndex(-1);
  const handlePieClick = (entry) => onCategoryClick(entry.name);

  return (
    <Card>
      {/* FIX: Removed fixed height. The card will now size to its content. */}
      <CardContent sx={{ display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h6">Spending Breakdown</Typography>
        
        {safeData.length === 0 ? (
          <NoDataDisplay />
        ) : (
          <>
            {/* FIX: Chart container now has a fixed height */}
            <Box sx={{ height: 300, width: '100%', position: 'relative' }}>
              <Box sx={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  textAlign: 'center', pointerEvents: 'none'
              }}>
                {activeIndex === -1 ? (
                  <>
                    <Typography variant="body1" color="text.secondary">Total</Typography>
                    {/* FIX: Reduced total amount font size */}
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                      ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </>
                ) : (
                  <>
                    {/* FIX: Reduced category heading font size */}
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: safeData[activeIndex]?.color }}>
                      {safeData[activeIndex]?.name}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      ₹{safeData[activeIndex]?.value.toFixed(2)}
                    </Typography>
                  </>
                )}
              </Box>

              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={safeData}
                    cx="50%" cy="50%" innerRadius={80} outerRadius={110}
                    paddingAngle={5} cornerRadius={8} dataKey="value"
                    activeIndex={activeIndex} activeShape={<RenderActiveShape theme={theme} />}
                    onMouseEnter={onPieEnter} onMouseLeave={onPieLeave}
                    onClick={handlePieClick} style={{ outline: 'none' }}
                  >
                     {safeData.map((entry) => (
                        <Cell key={`cell-${entry.name}`} fill={entry.color} style={{ outline: 'none' }} />
                     ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </Box>
            {/* FIX: Legend is now a direct child and will be fully visible */}
            <CustomLegend payload={safeData.map((entry) => ({ value: entry.name, color: entry.color }))} />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default SpendingChartView;