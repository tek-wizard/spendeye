import { useTheme } from '@mui/material/styles';

// Import all the icons
import FastfoodIcon from '@mui/icons-material/Fastfood';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import LightbulbOutlinedIcon from '@mui/icons-material/LightbulbOutlined';
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import PriceCheckOutlinedIcon from '@mui/icons-material/PriceCheckOutlined';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';

// This hook can now be imported and used by any component
export const useCategoryMaps = () => {
  const theme = useTheme();
  return {
    categoryColors: {
      'Housing': theme.palette.charts.color1,
      'Utilities': theme.palette.charts.color2,
      'Food': theme.palette.charts.color3,
      'Transportation': theme.palette.charts.color4,
      'Health': theme.palette.charts.color5,
      'Education': theme.palette.charts.color1,
      'Entertainment': theme.palette.charts.color2,
      'Shopping': theme.palette.charts.color3,
      'Debt Repayment': theme.palette.charts.color4,
      'Loan Given': theme.palette.charts.color5,
      'Miscellaneous': theme.palette.secondary.main,
    },
    categoryIcons: {
      'Housing': <HomeWorkOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Utilities': <LightbulbOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Food': <FastfoodIcon sx={{ color: 'primary.contrastText' }} />,
      'Transportation': <DirectionsCarIcon sx={{ color: 'primary.contrastText' }} />,
      'Health': <MedicalServicesOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Education': <SchoolOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Entertainment': <TheaterComedyIcon sx={{ color: 'primary.contrastText' }} />,
      'Shopping': <ShoppingBagOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Debt Repayment': <AccountBalanceOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Loan Given': <PriceCheckOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
      'Miscellaneous': <MoreHorizOutlinedIcon sx={{ color: 'primary.contrastText' }} />,
    }
  };
};