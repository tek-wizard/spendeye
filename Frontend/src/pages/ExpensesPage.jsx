import React, { useState, useMemo } from "react"
import {
  Box,
  Grid,
  Chip,
  useTheme,
  useMediaQuery,
  Typography,
  Stack,
  Paper,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
  Badge,
  Modal,
  Slide,
  Backdrop,
  Skeleton,
} from "@mui/material"
import {
  startOfMonth,
  endOfMonth,
  differenceInDays,
  format,
  isToday,
  isYesterday,
} from "date-fns"
import SearchIcon from "@mui/icons-material/Search"
import TuneIcon from "@mui/icons-material/Tune"
import WarningAmberIcon from "@mui/icons-material/WarningAmber"

// --- Components ---
import { ExpenseSummaryCard } from "../components/ExpensesPage/ExpenseSummaryCard"
import { FullTransactionList } from "../components/ExpensesPage/FullTransactionList"
import { ExpenseBarChart } from "../components/ExpensesPage/ExpenseBarChart"
import { FilterSidebar } from "../components/ExpensesPage/FilterSidebar"
import { MetricCard } from "../components/ExpensesPage/MetricCard"
import { TransactionDetailModal } from "../components/RecentTransactions/TransactionDetailModal"
import { EditExpenseModal } from "../components/AddExpenseFlow/EditExpenseModal"
import { ConfirmationModal } from "../components/ConfirmationModal"

// --- Hooks & Utils ---
import { useExpenses } from "../hooks/useExpenses"
import { useDebounce } from "../hooks/useDebounce"
import { useDeleteExpense } from "../hooks/useDeleteExpense"
import { useCategoryMaps } from "../utils/categoryMaps"

const defaultFilters = {
  selectedCategories: [],
  amountRange: [0, 50000],
  isSplitFilter: null,
}

const ExpensesPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  // --- STATE and DATA PROCESSING ---
  const [dateRange, setDateRange] = useState({
    startDate: new Date("1970-01-01"),
    endDate: new Date(),
    label: "All Time",
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState(defaultFilters)
  const [page, setPage] = useState(1)
  const [isFilterPanelOpen, setFilterPanelOpen] = useState(false)
  const [selectedTransaction, setSelectedTransaction] = useState(null)
  const [expenseToEdit, setExpenseToEdit] = useState(null)
  const [expenseToDelete, setExpenseToDelete] = useState(null)
  const { rawExpenses, isLoading } = useExpenses(dateRange)
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const { deleteExpense, isDeleting } = useDeleteExpense()
  const { categoryColors, categoryIcons } = useCategoryMaps()
  const filteredTransactions = useMemo(() => {
    if (!rawExpenses) return []
    return rawExpenses.filter((tx) => {
      const { selectedCategories, amountRange, isSplitFilter } = filters
      const searchMatch = debouncedSearchTerm
        ? tx.notes?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
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
  const transactionsWithGroupInfo = useMemo(() => {
    return filteredTransactions.map((tx, index, arr) => {
      const prevTx = arr[index - 1]
      const nextTx = arr[index + 1]
      const isFirstInGroup =
        tx.groupId && (!prevTx || prevTx.groupId !== tx.groupId)
      const isLastInGroup =
        tx.groupId && (!nextTx || nextTx.groupId !== tx.groupId)
      const isInGroup = tx.groupId && !isFirstInGroup && !isLastInGroup
      return {
        ...tx,
        groupPosition: isFirstInGroup
          ? "first"
          : isLastInGroup
          ? "last"
          : isInGroup
          ? "middle"
          : null,
      }
    })
  }, [filteredTransactions])
  const metrics = useMemo(() => {
    const totalSpent = transactionsWithGroupInfo.reduce(
      (acc, tx) => acc + tx.totalAmount,
      0
    )

    const uniqueTransactionIds = new Set()
    transactionsWithGroupInfo.forEach((tx) => {
      if (tx.groupId) {
        uniqueTransactionIds.add(tx.groupId)
      } else {
        uniqueTransactionIds.add(tx._id)
      }
    })
    const totalTransactions = uniqueTransactionIds.size

    const days = differenceInDays(dateRange.endDate, dateRange.startDate) + 1
    const averageDailySpend = totalSpent / (days > 0 ? days : 1)
    return { totalSpent, totalTransactions, averageDailySpend }
  }, [transactionsWithGroupInfo, dateRange])
  const categoryBreakdown = useMemo(() => {
    const breakdown = transactionsWithGroupInfo.reduce((acc, tx) => {
      if (!acc[tx.category]) acc[tx.category] = 0
      acc[tx.category] += tx.totalAmount
      return acc
    }, {})
    return Object.entries(breakdown)
      .map(([category, total]) => ({ category, total }))
      .sort((a, b) => b.total - a.total)
  }, [transactionsWithGroupInfo])
  const paginatedTransactions = useMemo(() => {
    const limit = 25
    const start = (page - 1) * limit
    return transactionsWithGroupInfo.slice(start, start + limit)
  }, [transactionsWithGroupInfo, page])
  const pagination = useMemo(
    () => ({
      currentPage: page,
      totalPages: Math.ceil(transactionsWithGroupInfo.length / 25),
      totalTransactions: transactionsWithGroupInfo.length,
    }),
    [transactionsWithGroupInfo, page]
  )
  const groupedTransactions = useMemo(() => {
    return paginatedTransactions.reduce((acc, tx) => {
      const date = new Date(tx.date)
      const group = isToday(date)
        ? "Today"
        : isYesterday(date)
        ? "Yesterday"
        : format(date, "MMMM d, yyyy")
      if (!acc[group]) acc[group] = []
      acc[group].push({
        ...tx,
        type: tx.category,
        amount: tx.totalAmount,
        icon: categoryIcons[tx.category] || categoryIcons["Miscellaneous"],
        color: categoryColors[tx.category] || categoryColors["Miscellaneous"],
      })
      return acc
    }, {})
  }, [paginatedTransactions, categoryIcons, categoryColors])
  const handleFilterChange = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }))
    setPage(1)
  }
  const handleApplyFilters = () => setFilterPanelOpen(false)
  const handleResetFilters = () => {
    setFilters(defaultFilters)
    setSearchTerm("")
    setPage(1)
    setDateRange({
      startDate: new Date("1970-01-01"),
      endDate: new Date(),
      label: "All Time",
    })
    setFilterPanelOpen(false)
  }
  const handleCategoryChartClick = (category) => {
    setFilters((prev) => ({ ...prev, selectedCategories: [category] }))
    setPage(1)
  }
  const activeFilterCount =
    (dateRange.label !== "All Time" ? 1 : 0) +
    filters.selectedCategories.length +
    (filters.isSplitFilter !== null ? 1 : 0) +
    (filters.amountRange[0] > 0 || filters.amountRange[1] < 50000 ? 1 : 0)

  // --- UI ---
  return (
    <Box>
      {/* --- MOBILE LAYOUT --- */}
      {isMobile ? (
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
          {isLoading ? (
            <Skeleton variant="rounded" height={500} />
          ) : (
            <FullTransactionList
              groupedTransactions={groupedTransactions}
              pagination={pagination}
              isLoading={isLoading}
              isFetching={false}
              onPageChange={(event, newPage) => setPage(newPage)}
              onTransactionClick={setSelectedTransaction}
            />
          )}
        </Stack>
      ) : (
        // --- DESKTOP LAYOUT ---
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          <div className="md:col-span-8">
            <Stack spacing={3}>
              <Paper
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  borderRadius: 3,
                  overflow: "hidden",
                  borderColor:
                    theme.palette.mode === "dark"
                      ? theme.palette.background.paper
                      : theme.palette.divider,
                  height: 48,
                  bgcolor: "rgba(200,200,200,0.15)",
                }}
              >
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Search transactions..."
                  size="small"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon
                          fontSize="small"
                          sx={{ color: "text.secondary" }}
                        />
                      </InputAdornment>
                    ),
                    sx: {
                      height: "100%",
                      "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                      "& input": { padding: "10px 0" },
                      fontSize: "0.95rem",
                    },
                  }}
                />
                <Tooltip title="Date & Advanced Filters">
                  <IconButton
                    onClick={() => setFilterPanelOpen(true)}
                    color={activeFilterCount > 0 ? "primary" : "default"}
                    sx={{
                      height: "100%",
                      px: 1.5,
                      borderLeft: "1px solid",
                      borderColor:
                        theme.palette.mode === "dark"
                          ? theme.palette.background.paper
                          : theme.palette.divider,
                      borderRadius: 0,
                      bgcolor: "rgba(200,200,200,0.2)",
                      "&:hover": { bgcolor: "rgba(200,200,200,0.3)" },
                    }}
                  >
                    <Badge badgeContent={activeFilterCount} color="primary">
                      <TuneIcon fontSize="small" />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Paper>
              {isLoading ? (
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={4}>
                    <Skeleton variant="rounded" height={88} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Skeleton variant="rounded" height={88} />
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Skeleton variant="rounded" height={88} />
                  </Grid>
                </Grid>
              ) : (
                <Grid container spacing={2.5}>
                  <Grid item xs={12} sm={4}>
                    <MetricCard
                      title="Total Spent"
                      value={(metrics?.totalSpent || 0).toLocaleString(
                        "en-IN",
                        { style: "currency", currency: "INR" }
                      )}
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
              )}
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

              {isLoading ? (
                <Skeleton variant="rounded" height={600} />
              ) : (
                <FullTransactionList
                  groupedTransactions={groupedTransactions}
                  pagination={pagination}
                  isLoading={isLoading}
                  isFetching={false}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onTransactionClick={setSelectedTransaction}
                />
              )}
            </Stack>
          </div>
          <div className="md:col-span-4">
            <Box sx={{ position: "sticky", top: 100 }}>
              {isLoading ? (
                <Skeleton variant="rounded" height={400} />
              ) : (
                <ExpenseBarChart
                  categoryBreakdown={categoryBreakdown}
                  onCategoryClick={handleCategoryChartClick}
                  isFetching={false}
                />
              )}
            </Box>
          </div>
        </div>
      )}
      <Modal
        open={isFilterPanelOpen}
        onClose={() => setFilterPanelOpen(false)}
        closeAfterTransition
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: {
              backdropFilter: "blur(10px)",
              backgroundColor: "rgba(0,0,0,0.7)",
            },
          },
        }}
      >
        <Slide direction={isMobile ? "up" : "left"} in={isFilterPanelOpen}>
          <Box
            sx={{
              position: "absolute",
              outline: 0,
              ...(isMobile
                ? { bottom: 16, left: 16, right: 16 }
                : {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    alignItems: "center",
                    p: 4,
                  }),
            }}
          >
            <FilterSidebar
              dateRange={dateRange}
              setDateRange={(newRange) => {
                setDateRange(newRange)
                setPage(1)
              }}
              filters={filters}
              onCategoryChange={(newCats) =>
                handleFilterChange({ selectedCategories: newCats })
              }
              onAmountChange={(newRange) =>
                handleFilterChange({ amountRange: newRange })
              }
              onSplitChange={(newSplit) =>
                handleFilterChange({ isSplitFilter: newSplit })
              }
              onApply={handleApplyFilters}
              onReset={handleResetFilters}
            />
          </Box>
        </Slide>
      </Modal>
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        isLocked={["Debt Repayment", "Loan Given"].includes(
          selectedTransaction?.category
        )}
        onEdit={() => {
          setExpenseToEdit(selectedTransaction)
          setSelectedTransaction(null)
        }}
        onDelete={() => {
          setExpenseToDelete(selectedTransaction)
          setSelectedTransaction(null)
        }}
      />
      <EditExpenseModal
        expense={expenseToEdit}
        open={Boolean(expenseToEdit)}
        onClose={() => setExpenseToEdit(null)}
      />
      <ConfirmationModal
        open={Boolean(expenseToDelete)}
        onClose={() => setExpenseToDelete(null)}
        onConfirm={() => {
          deleteExpense(expenseToDelete._id, {
            onSuccess: () => setExpenseToDelete(null),
          })
        }}
        title="Delete Expense?"
        confirmText="Delete"
        confirmColor="error"
        isLoading={isDeleting}
        icon={<WarningAmberIcon sx={{ fontSize: 32 }} />}
      >
        <Typography variant="body2">
          This action cannot be <strong>undone</strong>.
        </Typography>
      </ConfirmationModal>
    </Box>
  )
}

export default ExpensesPage
