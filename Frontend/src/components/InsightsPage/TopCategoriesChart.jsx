import React from 'react';
import { Paper, Typography, Box, Stack, Skeleton, useTheme } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, LabelList } from 'recharts';
import { useCategoryMaps } from '../../utils/categoryMaps';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';

const formatValue = (value) => {
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}k`;
  return `₹${value}`;
};

const renderCustomizedLabel = (props) => {
  const { x, y, width, height, value } = props;
  const theme = useTheme();
  return (
    <text x={x + width + 5} y={y + height / 2} fill={theme.palette.text.primary} textAnchor="start" dominantBaseline="middle" fontSize={12}>
      {formatValue(value)}
    </text>
  );
};

export const TopCategoriesChart = ({ data, isLoading }) => {
  const theme = useTheme();
  const { categoryColors } = useCategoryMaps();

  if (isLoading) {
    return <Skeleton variant="rounded" height={300} />;
  }

  const chartData = data?.slice(0, 5) || []; // Show top 5 categories

  return (
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Top Categories</Typography>
      <Box sx={{ height: 250, mt: 1 }}>
        {chartData.length === 0 ? (
          <Stack sx={{ height: '100%', alignItems: 'center', justifyContent: 'center', color: 'text.secondary' }}>
            <BarChartOutlinedIcon sx={{ fontSize: 48, mb: 2 }}/>
            <Typography>No category data available.</Typography>
          </Stack>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 50, left: 10, bottom: 5 }}>
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="category"
                stroke={theme.palette.text.secondary}
                tickLine={false}
                axisLine={false}
                width={100}
                tick={{ fontSize: 13, fill: theme.palette.text.secondary }}
              />
              <Tooltip cursor={{ fill: theme.palette.action.hover }} wrapperStyle={{ zIndex: 1100 }} content={() => null} />
              <Bar dataKey="total" radius={[0, 4, 4, 0]} barSize={22} animationDuration={800}>
                <LabelList dataKey="total" content={renderCustomizedLabel} />
                {chartData.map((entry) => (
                  <Cell key={`cell-${entry.category}`} fill={categoryColors[entry.category] || theme.palette.grey[500]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </Box>
    </Paper>
  );
};