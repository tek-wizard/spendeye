import React, { useMemo ,useState} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Skeleton, Stack } from '@mui/material';
import { HistoryPanel } from '../components/LedgerPage/HistoryPanel';
import { useLedgerPeople } from '../hooks/useLedgerPeople';
import { LedgerCreatorModal } from '../components/LedgerSnapshot/LedgerCreatorModal/LedgerCreatorModal';

const LedgerHistoryPage = () => {
    const { personName } = useParams();
    const navigate = useNavigate();

    const [isCreatorModalOpen, setCreatorModalOpen] = useState(false);
    
    const { data: peopleData, isLoading } = useLedgerPeople();

    const selectedPerson = useMemo(() => {
        if (isLoading) return null;
        const personFromList = peopleData?.find(p => p.person === personName);
        if (personFromList) return personFromList;
        return { person: personName, netBalance: 0 };
    }, [isLoading, peopleData, personName]);

    if (isLoading || !selectedPerson) {
        return (
            <Stack spacing={2} sx={{ p: 2 }}>
                <Skeleton variant="text" width="60%" height={40} />
                <Skeleton variant="rounded" height={80} />
                <Skeleton variant="rounded" height={80} />
            </Stack>
        );
    }

    return (
        <>
        <Box sx={{ height: '100vh', width: '100vw', bgcolor: 'background.default' }}>
            <HistoryPanel
                selectedPerson={selectedPerson}
                onClearSelection={() => navigate('/ledger')}
                onAddNewEntry={() => setCreatorModalOpen(true)}
            />
        </Box>
        <LedgerCreatorModal open={isCreatorModalOpen} onClose={() => setCreatorModalOpen(false)} />
        </>
    );
};

export default LedgerHistoryPage;