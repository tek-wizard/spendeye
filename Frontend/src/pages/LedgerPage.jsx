import React, { useState, useMemo, useEffect } from 'react';
import { Box, useTheme, useMediaQuery, Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

// --- Hooks ---
import { useLedgerSummary } from '../hooks/useLedgerSummary';
import { useLedgerPeople } from '../hooks/useLedgerPeople';
import { useContacts } from '../hooks/useContacts';

// --- Child Components ---
import { LedgerCreatorPanel } from '../components/LedgerPage/LedgerCreatorPanel';
import { PeoplePanel } from '../components/LedgerPage/PeoplePanel';
import { HistoryPanel } from '../components/LedgerPage/HistoryPanel';

const LedgerPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate();

  const [selectedPerson, setSelectedPerson] = useState(null);

  // --- Data Fetching ---
  const { data: summaryData, isLoading: isSummaryLoading } = useLedgerSummary();
  const { data: ledgerPeople, isLoading: arePeopleLoading } = useLedgerPeople();
  const { data: allContacts, isLoading: areContactsLoading } = useContacts();
  const isLoading = isSummaryLoading || arePeopleLoading || areContactsLoading;

  const mergedPeopleData = useMemo(() => {
    if (!allContacts) return [];
    const balanceMap = new Map();
    if (ledgerPeople) {
      ledgerPeople.forEach(p => balanceMap.set(p.person, p.netBalance));
    }
    return allContacts.map(contact => ({
      person: contact.name,
      netBalance: balanceMap.get(contact.name) || 0,
    }));
  }, [allContacts, ledgerPeople]);

  useEffect(() => {
    if (selectedPerson && mergedPeopleData) {
      const updatedPerson = mergedPeopleData.find(p => p.person === selectedPerson.person);
      if (updatedPerson) {
        setSelectedPerson(updatedPerson);
      }
    }
  }, [mergedPeopleData, selectedPerson]);

  const handleSelectPerson = (person) => {
    if (isDesktop) {
        setSelectedPerson(person);
    } else {
        navigate(`/ledger/${encodeURIComponent(person.person)}`);
    }
  };

  return (
    <Box>
        {isDesktop ? (
            // --- DESKTOP LAYOUT ---
            <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 120px)' }}>
                {/* Left Column */}
                <Stack spacing={3} sx={{ width: '33%', minWidth: 380 }}>
                    <LedgerCreatorPanel summaryData={summaryData} isLoading={isLoading} />
                    <Box sx={{ flexGrow: 1, minHeight: 0 }}>
                        <PeoplePanel people={mergedPeopleData} isLoading={isLoading} selectedPerson={selectedPerson} onSelectPerson={handleSelectPerson} />
                    </Box>
                </Stack>
                {/* Right Column */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                    <HistoryPanel selectedPerson={selectedPerson} />
                </Box>
            </Box>
        ) : (
            // --- MOBILE LAYOUT ---
            <Stack spacing={3}>
                <LedgerCreatorPanel summaryData={summaryData} isLoading={isLoading} />
                <PeoplePanel people={mergedPeopleData} isLoading={isLoading} selectedPerson={null} onSelectPerson={handleSelectPerson} />
            </Stack>
        )}
    </Box>
  );
};

export default LedgerPage;