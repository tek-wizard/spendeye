
import React from 'react';
import { Paper, Typography, Box, LinearProgress, useTheme, Stack } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useCategoryMaps } from '../../utils/categoryMaps';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

// A professional number formatter for our labels (e.g., 5240 -> 5.2k)
const formatValue = (value) => {
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}k`;
  }
  return `₹${value}`;
};

// A custom component to render our data labels with perfect positioning and style
const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  const theme = useTheme();
  return (
    <text x={x + width + 5} y={y + height / 2} fill={theme.palette.text.primary} textAnchor="start" dominantBaseline="middle" fontSize={12}>
      {formatValue(value)}
    </text>
  );
};

export const ExpenseBarChart = React.memo(({ categoryBreakdown, onCategoryClick, isFetching }) => {
  const theme = useTheme();
  const { categoryColors } = useCategoryMaps();

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <Paper elevation={3} sx={{ p: 1.5, borderRadius: 2 }}>
          <Typography variant="caption" color="text.secondary">{label}</Typography>
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {payload[0].value.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
          </Typography>
        </Paper>
      );
    }
    return null;
  };
  
  // Prevents long labels from breaking the layout
  const truncateLabel = (label) => {
    if (label.length > 12) {
      return `${label.substring(0, 10)}...`;
    }
    return label;
  };

  return (
    <Paper variant="outlined" sx={{ p: 2.5, height: 400, borderRadius: 2, position: 'relative', overflow: 'hidden' }}>
      {isFetching && <LinearProgress sx={{ position: 'absolute', top: 0, left: 0, width: '100%' }} />}
      <Typography
  variant="h6"
  sx={{
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    fontSize: {
      xs: 'clamp(0.9rem, 3vw, 1.2rem)', 
      sm: 'clamp(1rem, 2vw, 1.25rem)', 
      md: '1.25rem',                     
    },
  }}
>
  Spending by Category
</Typography>

      
      <Box sx={{ opacity: isFetching ? 0.7 : 1, transition: 'opacity 300ms ease-in-out', height: 'calc(100% - 32px)', mt: 1 }}>
        {!categoryBreakdown || categoryBreakdown.length === 0 ? (
          // THE FIX: An enhanced, more visual empty state
          <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary', textAlign: 'center' }}>
            <BarChartOutlinedIcon sx={{ fontSize: 48, mb: 2 }}/>
            <Typography variant="h6" gutterBottom>No Spending Data</Typography>
            <Typography variant="body2">Your category spending will appear here.</Typography>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryBreakdown} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis 
                type="category" 
                dataKey="category" 
                stroke={theme.palette.text.secondary} 
                tickLine={false} 
                axisLine={false} 
                width={100} 
                tick={{ fontSize: 13, fill: theme.palette.text.secondary }} 
                tickFormatter={truncateLabel} 
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: theme.palette.action.hover }} wrapperStyle={{ zIndex: 1100 }}/>
              <Bar 
                dataKey="total" 
                radius={[0, 4, 4, 0]} 
                barSize={22} 
                onClick={(data) => onCategoryClick(data.category)}
                animationDuration={800} // A slightly longer, more elegant animation
                animationEasing="ease-out"
              >
                {/* THE FIX: Added a LabelList to display data directly on the chart */}
                <LabelList dataKey="total" content={renderCustomizedLabel} />
                {categoryBreakdown.map((entry) => (
                  <Cell key={`cell-${entry.category}`} fill={categoryColors[entry.category] || theme.palette.grey[500]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
});