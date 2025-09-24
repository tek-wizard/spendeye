import React, { useState, useMemo } from 'react';
import { Box, Skeleton, Typography } from '@mui/material';
import { RecentTransactionsList } from './RecentTransactionsList';
import { TransactionDetailModal } from './TransactionDetailModal';
import { EditExpenseModal } from '../AddExpenseFlow/EditExpenseModal';
import { ConfirmationModal } from '../ConfirmationModal';
import { useDeleteExpense } from '../../hooks/useDeleteExpense';
import { useCategoryMaps } from '../../utils/categoryMaps.jsx'; 
import { format, isToday, isYesterday } from 'date-fns';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

export const RecentTransactions = ({ expenses, isLoading }) => {
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [expenseToEdit, setExpenseToEdit] = useState(null);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  
  const { categoryColors, categoryIcons } = useCategoryMaps();
  const { deleteExpense, isDeleting } = useDeleteExpense();

  const processedTransactions = useMemo(() => {
    if (!expenses || isLoading) return {};

    let initialList = [...expenses];
    if (searchQuery) {
      initialList = initialList.filter(tx =>
        (tx.category && tx.category.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (tx.notes && tx.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // 1. Pre-process to find groups and calculate their total value
    const groupTotals = new Map();
    initialList.forEach(tx => {
      if (tx.groupId) {
        const currentTotal = groupTotals.get(tx.groupId) || 0;
        groupTotals.set(tx.groupId, currentTotal + tx.totalAmount);
      }
    });

    // 2. Create a new list where each item knows its "sortable" total
    const sortableList = initialList.map(tx => ({
      ...tx,
      // If it's in a group, use the group's total. Otherwise, use its own amount.
      sortAmount: tx.groupId ? groupTotals.get(tx.groupId) : tx.totalAmount,
    }));

    // 3. Sort the entire list based on the new sortAmount
    sortableList.sort((a, b) => {
      if (sortBy === 'amount') {
        // Keep items of the same group together by sub-sorting by date
        if (a.sortAmount === b.sortAmount) {
            return new Date(b.date) - new Date(a.date);
        }
        return b.sortAmount - a.sortAmount;
      }
      return new Date(b.date) - new Date(a.date);
    });

    // 4. Add the visual linking flags to the now correctly sorted list
    const finalList = sortableList.map((tx, index, arr) => {
      const prevTx = arr[index - 1];
      const nextTx = arr[index + 1];
      
      const isFirstInGroup = tx.groupId && (!prevTx || prevTx.groupId !== tx.groupId);
      const isLastInGroup = tx.groupId && (!nextTx || nextTx.groupId !== tx.groupId);
      const isInGroup = tx.groupId && !isFirstInGroup && !isLastInGroup;

      return {
        ...tx,
        amount: tx.totalAmount,
        type: tx.category,
        description: tx.groupId ? null : tx.notes,
        icon: categoryIcons[tx.category] || categoryIcons['Miscellaneous'],
        color: categoryColors[tx.category] || categoryColors['Miscellaneous'],
        groupPosition: isFirstInGroup ? 'first' : isLastInGroup ? 'last' : isInGroup ? 'middle' : null,
      };
    });

    // 5. Group by date for the final render
    return finalList.reduce((acc, tx) => {
        const date = new Date(tx.date);
        const group = isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMMM do, yyyy');
        if (!acc[group]) acc[group] = [];
        acc[group].push(tx);
        return acc;
    }, {});
  }, [expenses, searchQuery, sortBy, categoryColors, categoryIcons, isLoading]);

  if (isLoading) {
    return <Skeleton variant="rounded" sx={{ bgcolor: "background.paper", border: 1, borderColor: 'divider' }} height={400} />;
  }

  return (
    <>
      <RecentTransactionsList
        transactions={processedTransactions}
        onTransactionClick={setSelectedTransaction}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onSortChange={setSortBy}
      />
      <TransactionDetailModal
        transaction={selectedTransaction}
        open={Boolean(selectedTransaction)}
        onClose={() => setSelectedTransaction(null)}
        isLocked={['Debt Repayment', 'Loan Given'].includes(selectedTransaction?.category)}
        onEdit={() => {
          setExpenseToEdit(selectedTransaction);
          setSelectedTransaction(null); 
        }}
        onDelete={() => {
          setExpenseToDelete(selectedTransaction);
          setSelectedTransaction(null);
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
          });
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
    </>
  );
};