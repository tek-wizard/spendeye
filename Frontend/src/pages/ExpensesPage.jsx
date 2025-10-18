import React, { useState, useMemo } from "react"
import {
  Box,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Typography,
  Stack,
  Drawer,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Badge,
  Modal,
  Slide,
  Backdrop
} from "@mui/material"
import { startOfMonth, endOfMonth, differenceInDays } from "date-fns"
import SearchIcon from "@mui/icons-material/Search"
import TuneIcon from "@mui/icons-material/Tune"

// Import all perfected child components and hooks
import { ExpenseSummaryCard } from "../components/ExpensesPage/ExpenseSummaryCard"
import { FilterSheet } from "../components/ExpensesPage/FilterSheet"
import { FullTransactionList } from "../components/ExpensesPage/FullTransactionList"
import { ExpenseBarChart } from "../components/ExpensesPage/ExpenseBarChart"
import { FilterSidebar } from "../components/ExpensesPage/FilterSidebar"
import { MetricCard } from "../components/ExpensesPage/MetricCard"
import { useExpenses } from "../hooks/useExpenses"
import { useDebounce } from "../hooks/useDebounce"
import { FilterPanel } from "../components/ExpensesPage/FilterPanel"

const defaultFilters = {
  selectedCategories: [],
  amountRange: [0, 50000],
  isSplitFilter: null,
}

const ExpensesPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // --- STATE & DATA LOGIC (This logic is final and correct) ---
  const [dateRange, setDateRange] = useState({
    startDate: startOfMonth(new Date()),
    endDate: endOfMonth(new Date()),
    label: "This Month",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false)
  const { rawExpenses, isLoading } = useExpenses(dateRange)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const filteredTransactions = useMemo(() => {
    if (!rawExpenses) return []
    return rawExpenses.filter((tx) => {
      const { selectedCategories, amountRange, isSplitFilter } = filters
      const searchMatch = debouncedSearchTerm
        ? tx.notes.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        : true
      const categoryMatch =
        selectedCategories.length > 0
          ? selectedCategories.includes(tx.category)
          : true
      const amountMatch =
        tx.totalAmount >= amountRange[0] && tx.totalAmount <= amountRange[1]
      const splitMatch =
        isSplitFilter !== null ? tx.isSplit === isSplitFilter : true
      return searchMatch && categoryMatch && amountMatch && splitMatch
    })
  }, [rawExpenses, filters, debouncedSearchTerm])
  const metrics = useMemo(() => {
    const totalSpent = filteredTransactions.reduce(
      (acc, tx) => acc + tx.totalAmount,
      0
    )
    const totalTransactions = filteredTransactions.length
    const days = differenceInDays(dateRange.endDate, dateRange.startDate) + 1
    const averageDailySpend = totalSpent / (days > 0 ? days : 1)
    return { totalSpent, totalTransactions, averageDailySpend }
  }, [filteredTransactions, dateRange])
  const categoryBreakdown = useMemo(() => {
    const breakdown = filteredTransactions.reduce((acc, tx) => {
      if (!acc[tx.category]) {
        acc[tx.category] = 0
      }
      acc[tx.category] += tx.totalAmount
      return acc
    }, {})
    return Object.entries(breakdown)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
  }, [filteredTransactions])
  const paginatedTransactions = useMemo(() => {
    const limit = 25
    const start = (page - 1) * limit
    const end = start + limit
    return filteredTransactions.slice(start, end)
  }, [filteredTransactions, page])
  const pagination = useMemo(
    () => ({
      currentPage: page,
      totalPages: Math.ceil(filteredTransactions.length / 25),
      totalTransactions: filteredTransactions.length,
    }),
    [filteredTransactions, page]
  )
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }
  const handleApplyFilters = () => {
    setFilterPanelOpen(false)
  }
  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setSearchTerm("")
    setPage(1)
    setFilterPanelOpen(false)
  }
  const handleCategoryChartClick = (category) => {
    setFilters((prev) => ({ ...prev, selectedCategories: [category] }))
    setPage(1)
  }
  const activeFilterCount =
    (dateRange.label !== "This Month" ? 1 : 0) +
    filters.selectedCategories.length +
    (filters.isSplitFilter !== null ? 1 : 0) +
    (filters.amountRange[0] > 0 || filters.amountRange[1] < 50000 ? 1 : 0)


  return (
    <Box>
      {/* --- MOBILE-ONLY LAYOUT (This is already minimal and professional) --- */}
      {isMobile && (
        <Stack spacing={3}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              variant="standard"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
                disableUnderline: true,
              }}
              sx={{ bgcolor: "action.hover", borderRadius: 1.5, p: "4px 8px" }}
            />
            <Tooltip title="Filters">
              <IconButton onClick={() => setFilterPanelOpen(true)}>
                <Badge badgeContent={activeFilterCount} color="primary">
                  <TuneIcon />
                </Badge>
              </IconButton>
            </Tooltip>
          </Box>
          <ExpenseSummaryCard
            metrics={metrics}
            categoryBreakdown={categoryBreakdown}
            isLoading={isLoading}
          />
          {filters.selectedCategories.length > 0 && (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filters.selectedCategories.map((cat) => (
                <Chip
                  key={cat}
                  label={cat}
                  onDelete={() =>
                    handleFilterChange({
                      selectedCategories: filters.selectedCategories.filter(
                        (c) => c !== cat
                      ),
                    })
                  }
                  color="primary"
                  size="small"
                  sx={{
                    bgcolor: "accent.main",
                    color: "accent.contrastText",
                    fontWeight: "medium",
                  }}
                />
              ))}
            </Box>
          )}
          <FullTransactionList
            transactions={paginatedTransactions}
            pagination={pagination}
            isLoading={isLoading}
            isFetching={false}
            onPageChange={(event, newPage) => setPage(newPage)}
          />
        </Stack>
      )}

      {/* --- DESKTOP-ONLY AESTHETIC LAYOUT --- */}
      {!isMobile && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* --- Left Column: Primary Data Feed & Controls --- */}
          <div className="md:col-span-8">
            <Stack spacing={3}>
              {/* 2. Unified Control Panel */}
              <Paper
                variant="outlined"
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  borderRadius: 2,
                }}
              >
                <TextField
                  fullWidth
                  variant="standard"
                  placeholder="Search in notes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon color="disabled" />
                      </InputAdornment>
                    ),
                    disableUnderline: true,
                  }}
                  sx={{ pl: 1 }}
                />
                <Tooltip title="Date & Advanced Filters">
                  <IconButton
                    onClick={() => setFilterPanelOpen(true)}
                    color={activeFilterCount > 0 ? "primary" : "inherit"}
                  >
                    <Badge badgeContent={activeFilterCount} color="primary">
                      <TuneIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Paper>

              {/* 1. Metrics */}
              <Grid container spacing={2.5}>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="Total Spent"
                    value={(metrics?.totalSpent || 0).toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="Avg. Daily Spend"
                    value={(metrics?.averageDailySpend || 0).toLocaleString(
                      "en-IN",
                      { style: "currency", currency: "INR" }
                    )}
                    isLoading={isLoading}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <MetricCard
                    title="Transactions"
                    value={metrics?.totalTransactions || 0}
                    isLoading={isLoading}
                  />
                </Grid>
              </Grid>

              {/* 3. Active Filter Chips */}
              {filters.selectedCategories.length > 0 && (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {filters.selectedCategories.map((cat) => (
                    <Chip
                      key={cat}
                      label={cat}
                      onDelete={() =>
                        handleFilterChange({
                          selectedCategories: filters.selectedCategories.filter(
                            (c) => c !== cat
                          ),
                        })
                      }
                      color="primary"
                      size="small"
                      sx={{
                        bgcolor: "accent.main",
                        color: "accent.contrastText",
                        fontWeight: "medium",
                      }}
                    />
                  ))}
                </Box>
              )}

              {/* 4. Transaction List */}
              <FullTransactionList
                transactions={paginatedTransactions}
                pagination={pagination}
                isLoading={isLoading}
                isFetching={false}
                onPageChange={(event, newPage) => setPage(newPage)}
              />
            </Stack>
          </div>

          {/* --- Right Column: Visualization --- */}
          <div className="md:col-span-4">
            <Box sx={{ position: "sticky", top: 100 }}>
              <ExpenseBarChart
                categoryBreakdown={categoryBreakdown}
                onCategoryClick={handleCategoryChartClick}
                isFetching={false}
              />
            </Box>
          </div>
        </div>
      )}

      {/* Filter Panel: Renders the correct component based on screen size */}
      <Modal
                open={isFilterPanelOpen}
                onClose={() => setFilterPanelOpen(false)}
                closeAfterTransition
                slots={{ backdrop: Backdrop }}
                slotProps={{
                    backdrop: {
                        timeout: 500,
                        sx: {
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                        }
                    },
                }}
            >
                <Slide direction={isMobile ? "up" : "left"} in={isFilterPanelOpen}>
                    {/* This Box is the positioning container for our floating panel */}
                    <Box sx={{
                        position: 'absolute',
                        outline: 0, // Remove focus outline from the modal
                        // --- Responsive Positioning ---
                        ...(isMobile 
                            // On mobile, it floats at the bottom with margins
                            ? { bottom: 16, left: 16, right: 16 } 
                            // On desktop, it's vertically centered on the right with a margin
                            : { top: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', p: 4 }
                        )
                    }}>
                        <FilterSidebar 
                            dateRange={dateRange} 
                            setDateRange={(newRange) => { setDateRange(newRange); setPage(1); }}
                            filters={filters} 
                            onCategoryChange={(newCats) => handleFilterChange({ selectedCategories: newCats })} 
                            onAmountChange={(newRange) => handleFilterChange({ amountRange: newRange })} 
                            onSplitChange={(newSplit) => handleFilterChange({ isSplitFilter: newSplit })} 
                            onApply={handleApplyFilters} 
                            onReset={handleResetFilters} 
                        />
                    </Box>
                </Slide>
            </Modal>
      
    </Box>
  )
}

export default ExpensesPage
