import React from 'react';
import { Card, CardContent, Typography, Box, Skeleton, Stack, LinearProgress, useTheme,Divider } from '@mui/material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import { useCategoryMaps } from '../../utils/categoryMaps';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';

// --- HELPER SUB-COMPONENTS to keep the main component clean ---

const Metric = ({ title, value }) => (
  <Box sx={{ textAlign: 'center' }}>
    <Typography variant="body2" color="text.secondary">{title}</Typography>
    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>{value}</Typography>
  </Box>
);

const CategoryBreakdownItem = ({ category, amount, percentage, color }) => (
  <Box>
    <Stack direction="row" justifyContent="space-between" mb={0.5}>
      <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{category}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 'medium', flexShrink: 0, pl: 1 }}>{amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</Typography>
    </Stack>
    <LinearProgress 
      variant="determinate" 
      value={percentage} 
      sx={{ 
        height: 6, 
        borderRadius: 3, 
        bgcolor: 'action.hover', 
        '& .MuiLinearProgress-bar': { backgroundColor: color } 
      }} 
    />
  </Box>
);

// --- MAIN COMPONENT ---

export const ExpenseSummaryCard = React.memo(({ metrics, categoryBreakdown, isLoading }) => {
  const theme = useTheme();
  const { categoryColors } = useCategoryMaps();
  const totalSpent = metrics?.totalSpent || 0;

  if (isLoading) {
    // An "anatomical" skeleton that mimics the card's layout for a smooth loading experience.
    return (
      <Card>
        <CardContent>
          <Skeleton variant="rectangular" height={120} sx={{ borderRadius: 1 }} />
          <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 1.5 }}>
            <Skeleton variant="circular" width={8} height={8} />
            <Skeleton variant="circular" width={8} height={8} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent sx={{ p: 2, '& .swiper-pagination': { position: 'relative', bottom: '-8px' }, '& .swiper-pagination-bullet-active': { bgcolor: 'primary.main' } }}>
        <Box sx={{ touchAction: 'pan-y' }}> {/* Prevents page scroll while swiping */}
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={0}
            slidesPerView={1}
          >
            <SwiperSlide>
              {/* THE FIX: New 'Hero' Metric Layout for better visual hierarchy */}
              <Stack alignItems="center" justifyContent="center" sx={{ height: 140 }}>
                <Typography variant="body2" color="text.secondary">Total Spent</Typography>
                <Typography variant="h4" sx={{ fontWeight: 'bold', my: 1 }}>
                  {(metrics?.totalSpent || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </Typography>
                <Divider sx={{ width: '80%', my: 1 }} />
                <Stack direction="row" spacing={4} justifyContent="center">
                    <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">Avg. Daily</Typography>
                        <Typography sx={{ fontWeight: 'medium' }}>{(metrics?.averageDailySpend || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 })}</Typography>
                    </Box>
                    <Box textAlign="center">
                        <Typography variant="caption" color="text.secondary">Transactions</Typography>
                        <Typography sx={{ fontWeight: 'medium' }}>{metrics?.totalTransactions || 0}</Typography>
                    </Box>
                </Stack>
              </Stack>
            </SwiperSlide>
            
            <SwiperSlide>
              {/* THE FIX: Refined Category Layout with more breathing room */}
              <Stack spacing={2} sx={{ p: 1, height: 140, justifyContent: 'center' }}>
                {(categoryBreakdown || []).slice(0, 3).map((cat) => (
                  <CategoryBreakdownItem
                    key={cat.category}
                    category={cat.category}
                    amount={cat.total}
                    percentage={totalSpent > 0 ? (cat.total / totalSpent) * 100 : 0}
                    color={categoryColors[cat.category] || theme.palette.grey[500]}
                  />
                ))}
                {(!categoryBreakdown || categoryBreakdown.length === 0) && (
                  <Typography sx={{ textAlign: 'center', color: 'text.secondary' }}>
                    No category data for this period
                  </Typography>
                )}
              </Stack>
            </SwiperSlide>
          </Swiper>
        </Box>
      </CardContent>
    </Card>
  );
});