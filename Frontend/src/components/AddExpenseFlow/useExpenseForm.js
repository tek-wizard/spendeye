import { useState, useEffect, useCallback } from 'react';

const emptyState = {
  amount: '', category: '', notes: '', date: new Date(),
  isShared: null, contacts: [], splits: [],
};

const getInitialState = (expenseToEdit) => {
  if (!expenseToEdit) {
    return emptyState;
  }

  return {
    _id: expenseToEdit._id,
    amount: expenseToEdit.totalAmount.toString(),
    category: expenseToEdit.category,
    notes: expenseToEdit.notes || '',
    date: new Date(expenseToEdit.date),
    isShared: expenseToEdit.isSplit,
    contacts: expenseToEdit.contacts || [],
    splits: [
      { participantId: 'user', amount: expenseToEdit.personalShare },
      ...(expenseToEdit.splitDetails || []).map(d => ({ participantId: d._id || d.person, amount: d.amountOwed }))
    ],
    linkedLedgerId: expenseToEdit.linkedLedgerId,
  };
};


export const useExpenseForm = (expenseToEdit = null) => {
  const [formData, setFormData] = useState(() => getInitialState(expenseToEdit));

  const updateFormData = useCallback((newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  }, []);

  useEffect(() => {
    setFormData(getInitialState(expenseToEdit));
  }, [expenseToEdit]);


  const clearFormData = useCallback(() => {
    setFormData(emptyState);
  }, []);

  return { formData, updateFormData, clearFormData };
};