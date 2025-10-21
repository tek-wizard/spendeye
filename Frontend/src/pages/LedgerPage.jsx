import React, { useState, useEffect, useMemo } from 'react';
import { Box, useTheme, useMediaQuery } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // ✅ NEW: for mobile navigation

// --- Hooks ---
import { useLedgerSummary } from '../hooks/useLedgerSummary';
import { useLedgerPeople } from '../hooks/useLedgerPeople';
import { useContacts } from '../hooks/useContacts';

// --- Components ---
import { LedgerHeader } from '../components/LedgerPage/LedgerHeader';
import { PeoplePanel } from '../components/LedgerPage/PeoplePanel';
import { HistoryPanel } from '../components/LedgerPage/HistoryPanel'; // ✅ Keep for desktop
import { LedgerCreatorModal } from '../components/LedgerSnapshot/LedgerCreatorModal/LedgerCreatorModal';

const LedgerPage = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const navigate = useNavigate(); // ✅ For mobile routing

  const [selectedPerson, setSelectedPerson] = useState(null);
  const [isCreatorModalOpen, setCreatorModalOpen] = useState(false);

  // --- Fetch Data ---
  const { data: summaryData, isLoading: isSummaryLoading } = useLedgerSummary();
  const { data: ledgerPeople, isLoading: arePeopleLoading } = useLedgerPeople();
  const { data: allContacts, isLoading: areContactsLoading } = useContacts();

  const isLoading = isSummaryLoading || arePeopleLoading || areContactsLoading;

  // --- Merge ledger balances into contacts ---
  const mergedPeopleData = useMemo(() => {
    if (!allContacts) return [];

    const balanceMap = new Map();
    if (ledgerPeople) {
      ledgerPeople.forEach((p) => balanceMap.set(p.person, p.netBalance));
    }

    return allContacts.map((contact) => ({
      person: contact.name,
      netBalance: balanceMap.get(contact.name) || 0,
    }));
  }, [allContacts, ledgerPeople]);

  // --- Sync selected person when data refreshes (for desktop only) ---
  useEffect(() => {
    if (selectedPerson && mergedPeopleData) {
      const updatedPerson = mergedPeopleData.find(
        (p) => p.person === selectedPerson.person
      );
      if (updatedPerson) setSelectedPerson(updatedPerson);
      else setSelectedPerson(null);
    }
  }, [mergedPeopleData, selectedPerson]);

  // --- Handle person selection ---
  const handleSelectPerson = (person) => {
    if (isDesktop) {
      setSelectedPerson(person);
    } else {
      // ✅ On mobile, navigate to the dedicated LedgerHistoryPage
      navigate(`/ledger/${encodeURIComponent(person.person)}`);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: { md: 'calc(100vh - 120px)' } }}>
      {/* --- HEADER --- */}
      <LedgerHeader
        summaryData={summaryData}
        peopleCount={allContacts?.length || 0}
        isLoading={isLoading}
        onAddNewEntry={() => setCreatorModalOpen(true)}
      />

      {/* --- MAIN CONTENT --- */}
      {isDesktop ? (
        // ✅ DESKTOP: side-by-side layout
        <Box sx={{ flexGrow: 1, display: 'flex', gap: 3, mt: 3, overflow: 'hidden' }}>
          {/* LEFT: People List */}
          <Box sx={{ width: '33%', minWidth: 380, display: 'flex' }}>
            <PeoplePanel
              people={mergedPeopleData}
              isLoading={isLoading}
              selectedPerson={selectedPerson}
              onSelectPerson={handleSelectPerson}
            />
          </Box>

          {/* RIGHT: History Panel */}
          <Box sx={{ flex: 1, display: 'flex', minWidth: 0 }}>
            <HistoryPanel
              selectedPerson={selectedPerson}
              onClearSelection={() => setSelectedPerson(null)}
              onAddNewEntry={() => setCreatorModalOpen(true)}
            />
          </Box>
        </Box>
      ) : (
        // ✅ MOBILE: show only the list, history handled by separate route
        <Box sx={{ mt: 3 }}>
          <PeoplePanel
            people={mergedPeopleData}
            isLoading={isLoading}
            selectedPerson={null}
            onSelectPerson={handleSelectPerson}
          />
        </Box>
      )}

      {/* --- CREATE LEDGER ENTRY MODAL --- */}
      <LedgerCreatorModal
        open={isCreatorModalOpen}
        onClose={() => setCreatorModalOpen(false)}
      />
    </Box>
  );
};

export default LedgerPage;
