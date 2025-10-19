import React from "react"
import {
  Box,
  Typography,
  List,
  Divider,
  Skeleton,
  Pagination,
  Stack,
  Paper,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  useMediaQuery,
  useTheme,
  LinearProgress,
  ListSubheader,
} from "@mui/material"
import { format } from "date-fns"
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined"

export const FullTransactionList = React.memo(
  ({
    groupedTransactions,
    onTransactionClick,
    pagination,
    isLoading,
    isFetching,
    onPageChange,
  }) => {
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

    return (
      <Paper
  variant="outlined"
  sx={{
    borderRadius: 2,
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    width: "100%",
  }}
>
        {isFetching && !isLoading && (
          <LinearProgress
            sx={{ position: "absolute", top: 0, left: 0, width: "100%" }}
          />
        )}

        <Box
          sx={{
            opacity: isFetching && !isLoading ? 0.7 : 1,
            transition: "opacity 300ms ease-in-out",
            flexGrow: 1,
            overflowY: "auto",
          }}
        >
          {isLoading ? (
            <Stack spacing={0} sx={{ p: "1px" }}>
              {Array.from(new Array(8)).map((_, index) => (
                <Skeleton key={index} variant="rectangular" height={68} />
              ))}
            </Stack>
          ) : !groupedTransactions ||
            Object.keys(groupedTransactions).length === 0 ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                p: 2,
                textAlign: "center",
              }}
            >
              <ReceiptLongOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                No Transactions Found
              </Typography>
              <Typography>
                Try adjusting your filters or selecting a different date range.
              </Typography>
            </Box>
          ) : (
            <List sx={{ p: 0 }}>
              {Object.entries(groupedTransactions).map(
                ([dateGroup, transactions]) => (
                  <li key={dateGroup}>
                    <ul style={{ padding: 0, margin: 0 }}>
                      <ListSubheader
                        sx={{ bgcolor: "background.paper", lineHeight: "40px" }}
                      >
                        {dateGroup}
                      </ListSubheader>

                      {transactions.map((tx, index) => {
                        const isLast = index === transactions.length - 1
                        const showDivider =
                          !tx.groupPosition || tx.groupPosition === "last"

                        // Hide notes if grouped
                        const secondaryText = tx.groupPosition
                          ? null
                          : tx.notes
                          ? `${tx.notes.substring(0, 40)}${
                              tx.notes.length > 40 ? "..." : ""
                            }`
                          : null

                        return (
                          <React.Fragment key={tx._id}>
                            <ListItemButton
                              onClick={() => onTransactionClick(tx)}
                              sx={{
                                py: 1,
                                ...(tx.groupPosition &&
                                  tx.groupPosition !== "first" && {
                                    marginTop: "-18px",
                                  }),
                                ...((tx.groupPosition === "first" ||
                                  tx.groupPosition === "middle") && {
                                  pb: "2px",
                                }),
                              }}
                            >
                              <ListItemAvatar sx={{ minWidth: 56 }}>
                                <Avatar
                                  sx={{
                                    width: 45,
                                    height: 45,
                                    bgcolor: tx.color || "secondary.main",
                                    border: "4px solid",
                                    borderColor: "background.paper",
                                    zIndex: 2,
                                    fontSize: 26,
                                  }}
                                >
                                  {tx.icon}
                                </Avatar>
                              </ListItemAvatar>

                              <ListItemText
                                primary={tx.category}
                                secondary={secondaryText}
                                primaryTypographyProps={{
                                  fontWeight: "medium",
                                  noWrap: true,
                                }}
                                secondaryTypographyProps={{
                                  fontSize: "0.8rem",
                                  noWrap: true,
                                }}
                              />

                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  ml: 2,
                                  whiteSpace: "nowrap",
                                }}
                              >
                                {tx.totalAmount.toLocaleString("en-IN", {
                                  style: "currency",
                                  currency: "INR",
                                })}
                              </Typography>
                            </ListItemButton>

                            {showDivider && !isLast && (
                              <Divider component="li" variant="inset" />
                            )}
                          </React.Fragment>
                        )
                      })}
                    </ul>
                  </li>
                )
              )}
            </List>
          )}
        </Box>

        {!isLoading && pagination && pagination.totalPages > 1 && (
          <Stack
            alignItems="center"
            sx={{ p: 2, borderTop: 1, borderColor: "divider" }}
          >
            <Pagination
              count={pagination.totalPages}
              page={pagination.currentPage}
              onChange={onPageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              disabled={isFetching}
            />
          </Stack>
        )}
      </Paper>
    )
  }
)
