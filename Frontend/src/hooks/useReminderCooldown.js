import { useState, useCallback, useEffect } from 'react';
import { differenceInHours, formatDistanceStrict } from 'date-fns';

const COOLDOWN_HOURS = 20;
const STORAGE_KEY = 'spendy_reminders_sent';

const getCooldownsFromStorage = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Failed to read cooldowns from localStorage", error);
      return {};
    }
};

export const useReminderCooldown = () => {
  const [cooldowns, setCooldowns] = useState(getCooldownsFromStorage);

  const setReminderSent = useCallback((contactId) => {
    try {
      const newCooldowns = { ...cooldowns, [contactId]: new Date().toISOString() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCooldowns));
      setCooldowns(newCooldowns); // This state update triggers a re-render
    } catch (error) {
      console.error("Failed to save cooldown to localStorage", error);
    }
  }, [cooldowns]);

  const checkCooldownStatus = useCallback((contactId) => {
    const lastSentIso = cooldowns[contactId];
    if (!lastSentIso) {
      return { onCooldown: false, timeLeft: null };
    }
    
    const hoursSinceSent = differenceInHours(new Date(), new Date(lastSentIso));
    if (hoursSinceSent >= COOLDOWN_HOURS) {
      return { onCooldown: false, timeLeft: null };
    }

    const cooldownEndDate = new Date(new Date(lastSentIso).getTime() + COOLDOWN_HOURS * 60 * 60 * 1000);
    const timeLeft = formatDistanceStrict(cooldownEndDate, new Date()).replace('in ', '');

    return { onCooldown: true, timeLeft };
  }, [cooldowns]);

  return { setReminderSent, checkCooldownStatus, cooldowns }; // Expose the state
};

//DELETE