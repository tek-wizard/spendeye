import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  IconButton,
  Skeleton,
  Avatar,
  Divider,
  Tooltip,
  Chip,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import HandshakeOutlinedIcon from "@mui/icons-material/HandshakeOutlined";
import { useLedgerHistory } from "../../hooks/useLedgerHistory";
import { useCreateLedgerEntry } from "../../hooks/useCreateLedgerEntry";
import { TransactionBubble } from "./TransactionBubble";
import { GroupedTransactionCard } from "./GroupedTransactionCard";
import { SettleUpModal } from "./SettleUpModal";
import { QuickEntryPanel } from "./QuickEntryPanel";
import { NotificationModal } from "../NotificationModal";
import { format, isSameDay } from "date-fns";
import { toast } from "sonner";

const EmptyState = () => (
  <Stack
    sx={{
      height: "100%",
      minHeight: 400,
      alignItems: "center",
      justifyContent: "center",
      color: "text.secondary",
      p: 3,
      textAlign: "center",
    }}
  >
    <AccountBalanceWalletOutlinedIcon sx={{ fontSize: 48, mb: 2 }} />
    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
      Select a Person
    </Typography>
    <Typography>
      Choose someone from the list to view your financial history with them.
    </Typography>
  </Stack>
);

export const HistoryPanel = ({ selectedPerson, onClearSelection }) => {
  const [isSettleModalOpen, setSettleModalOpen] = useState(false);
  const { data: history, isLoading } = useLedgerHistory(selectedPerson?.person);
  const { createLedgerEntry, isCreating } = useCreateLedgerEntry();
  const chatBodyRef = useRef(null);

  // --- State for Quick Entry & Notification ---
  const [entryStage, setEntryStage] = useState("amount");
  const [entryAmount, setEntryAmount] = useState("");
  const [entryNote, setEntryNote] = useState("");
  const [entryType, setEntryType] = useState(null);
  const [notification, setNotification] = useState({
    open: false,
    title: "",
    message: "",
    items: [],
  });

  // --- Scroll to bottom when history updates ---
  useEffect(() => {
    if (chatBodyRef.current) {
      chatBodyRef.current.scrollTop = chatBodyRef.current.scrollHeight;
    }
  }, [history]);

  // --- GROUP-AWARE chat item builder ---
  const chatItems = useMemo(() => {
    if (!history) return [];

    const items = [];
    let lastDate = null;
    const processedGroupIds = new Set();

    history.forEach((tx, index) => {
      // skip already processed grouped entries
      if (tx.groupId && processedGroupIds.has(tx.groupId.toString())) return;

      const txDate = new Date(tx.date);

      if (!lastDate || !isSameDay(lastDate, txDate)) {
        items.push({ type: "date_marker", id: `date-${tx._id}`, date: tx.date });
      }

      // --- GROUPED TRANSACTION ---
      if (tx.groupId) {
        const groupTransactions = history.filter(
          (h) => h.groupId?.toString() === tx.groupId.toString()
        );
        items.push({
          type: "grouped_transaction",
          id: tx.groupId.toString(),
          date: tx.date,
          transactions: groupTransactions,
        });
        processedGroupIds.add(tx.groupId.toString());
      } else {
        // --- NORMAL TRANSACTION ---
        const prevTx = history[index - 1];
        const nextTx = history[index + 1];
        const isSent = (type) => type === "Lent" || type === "Paid Back";

        const isFirstInGroup =
          !prevTx ||
          isSent(prevTx.type) !== isSent(tx.type) ||
          !isSameDay(new Date(prevTx.date), txDate);
        const isLastInGroup =
          !nextTx ||
          isSent(nextTx.type) !== isSent(tx.type) ||
          !isSameDay(new Date(nextTx.date), txDate);

        items.push({ ...tx, isFirstInGroup, isLastInGroup });
      }

      lastDate = txDate;
    });

    return items;
  }, [history]);

  // --- Loading Skeleton ---
  if (isLoading) {
    return (
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, height: "100%", width: "100%", p: 2 }}
      >
        <Stack spacing={2}>
          <Skeleton variant="text" width="60%" height={40} />
          <Divider />
          <Skeleton variant="rounded" height={80} />
          <Skeleton variant="rounded" height={80} />
          <Skeleton variant="rounded" height={80} />
        </Stack>
      </Paper>
    );
  }

  // --- Empty state ---
  if (!selectedPerson) {
    return (
      <Paper
        variant="outlined"
        sx={{ borderRadius: 2, height: "100%", width: "100%" }}
      >
        <EmptyState />
      </Paper>
    );
  }

  const { person, netBalance } = selectedPerson;
  const owesYou = netBalance > 0;

  // --- Reset Entry ---
  const handleResetEntry = () => {
    setEntryStage("amount");
    setEntryAmount("");
    setEntryNote("");
    setEntryType(null);
  };

  // --- Confirm Amount Stage ---
  const handleAmountConfirm = (type) => {
    setEntryType(type);
    setEntryStage("note");
  };

  // --- Commit Entry to Backend ---
  const handleCommitEntry = () => {
    if (isCreating) return;

    const ledgerEntryData = {
      person: person,
      amount: parseFloat(entryAmount),
      type: entryType,
      notes: entryNote.trim(),
      date: new Date(),
    };

    createLedgerEntry(ledgerEntryData, {
      onSuccess: (data) => {
        handleResetEntry();

        const createdItems = data.createdExpenses || data.createdLedgers || [];
        if (createdItems.length > 1) {
          setNotification({
            open: true,
            title: "Transaction Processed!",
            message:
              "Your payment was automatically split into the following entries for accuracy:",
            items: createdItems,
          });
        } 
      },
      onError: () => {
      },
    });
  };

  return (
    <>
      <Paper
        variant="outlined"
        sx={{
          borderRadius: { xs: 0, md: 2 },
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* --- HEADER --- */}
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ p: 2, borderBottom: 1, borderColor: "divider", flexShrink: 0 }}
        >
          <IconButton
            onClick={onClearSelection}
            sx={{ display: { md: "none" } }}
            size="small"
          >
            <ArrowBackIosNewIcon fontSize="inherit" />
          </IconButton>

          <Avatar
            sx={{
              bgcolor: "accent.main",
              color: "accent.contrastText",
              width: { xs: 36, md: 40 },
              height: { xs: 36, md: 40 },
            }}
          >
            {person.charAt(0).toUpperCase()}
          </Avatar>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Tooltip title={person} placement="bottom-start">
              <Typography
                noWrap
                sx={{
                  fontWeight: "bold",
                  fontSize: { xs: "1rem", md: "1.25rem" },
                }}
              >
                {person}
              </Typography>
            </Tooltip>

            <Typography
              variant="body2"
              sx={{
                fontWeight: "medium",
                fontSize: { xs: "0.8rem", md: "0.875rem" },
                color:
                  netBalance === 0
                    ? "text.secondary"
                    : owesYou
                    ? "success.main"
                    : "error.main",
              }}
            >
              {netBalance === 0
                ? "Settled up"
                : owesYou
                ? `Owes you ₹${netBalance.toLocaleString()}`
                : `You owe ₹${Math.abs(netBalance).toLocaleString()}`}
            </Typography>
          </Box>

          <Tooltip title="Settle Up">
            <span>
              <IconButton
                color="primary"
                onClick={() => setSettleModalOpen(true)}
                disabled={netBalance === 0}
              >
                <HandshakeOutlinedIcon />
              </IconButton>
            </span>
          </Tooltip>
        </Stack>

        {/* --- CHAT BODY --- */}
        <Box ref={chatBodyRef} sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
          {chatItems.length > 0 ? (
            chatItems.map((item) => {
              if (item.type === "date_marker") {
                return (
                  <Chip
                    key={item.id}
                    label={format(new Date(item.date), "MMMM d, yyyy")}
                    sx={{
                      display: "flex",
                      mx: "auto",
                      my: 2,
                      bgcolor: "action.hover",
                      background: "transparent",
                    }}
                  />
                );
              }

              if (item.type === "grouped_transaction") {
                return (
                  <GroupedTransactionCard key={item.id} group={item} />
                );
              }

              return (
                <TransactionBubble
                  key={item._id}
                  transaction={item}
                  isFirstInGroup={item.isFirstInGroup}
                  isLastInGroup={item.isLastInGroup}
                />
              );
            })
          ) : (
            <Box sx={{ textAlign: "center", p: 4, color: "text.secondary" }}>
              <Typography sx={{ wordBreak: "break-word" }}>
                No transaction history with
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: "bold",
                  color: "text.primary",
                  mt: 0.5,
                  wordBreak: "break-word",
                }}
              >
                {person}
              </Typography>
            </Box>
          )}
        </Box>

        {/* --- QUICK ENTRY PANEL --- */}
        <QuickEntryPanel
          stage={entryStage}
          amount={entryAmount}
          note={entryNote}
          setNote={setEntryNote}
          onAmountChange={setEntryAmount}
          onAmountConfirm={handleAmountConfirm}
          onCommit={handleCommitEntry}
          onReset={handleResetEntry}
          entryType={entryType}
          isCommitting={isCreating}
        />
      </Paper>

      <SettleUpModal
        open={isSettleModalOpen}
        onClose={() => setSettleModalOpen(false)}
        person={selectedPerson}
      />

      <NotificationModal
        open={notification.open}
        onClose={() => setNotification({ ...notification, open: false })}
        title={notification.title}
        message={notification.message}
        createdItems={notification.items}
      />
    </>
  );
};
