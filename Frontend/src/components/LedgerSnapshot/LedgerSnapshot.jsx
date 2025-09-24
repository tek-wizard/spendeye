import React, { useState } from "react"
import { Skeleton } from "@mui/material"
import LedgerSnapshotCard from "./LedgerSnapshotCard"
import { ViewDebtorsModal } from "./ViewDebtorsModal/ViewDebtorsModal"
import { ViewCreditorsModal } from "./ViewCreditorsModal/ViewCreditorsModal" // You will need to create this
import { LedgerCreatorModal } from "./LedgerCreatorModal/LedgerCreatorModal" // The new modal
import { useLedgerSummary } from "../../hooks/useLedgerSummary"
import { useDebtors } from "../../hooks/useDebtors"
import { useCreditors } from "../../hooks/useCreditors"

const LedgerSnapshot = () => {
  // State is now much simpler
  const [isCreatorModalOpen, setCreatorModalOpen] = useState(false)
  const [isViewDebtorsModalOpen, setViewDebtorsModalOpen] = useState(false)
  const [isViewCreditorsModalOpen, setViewCreditorsModalOpen] = useState(false)

  const { data: ledgerData, isLoading: isSummaryLoading } = useLedgerSummary()
  const { data: debtors, isLoading: areDebtorsLoading } = useDebtors()
  const { data: creditors, isLoading: areCreditorsLoading } = useCreditors()

  const isLoading = isSummaryLoading || areDebtorsLoading || areCreditorsLoading

  if (isLoading || !ledgerData) {
    return (
      <Skeleton variant="rounded" sx={{ bgcolor: "grey.900" }} height={160} />
    )
  }

  return (
    <>
      <LedgerSnapshotCard
        owedToYou={ledgerData.owedToYou}
        youOwe={ledgerData.youOwe}
        owedCount={ledgerData.owedCount}
        oweCount={ledgerData.oweCount}
        onViewDebtorsClick={() => setViewDebtorsModalOpen(true)}
        onViewCreditorsClick={() => setViewCreditorsModalOpen(true)}
        onAddLedgerClick={() => setCreatorModalOpen(true)}
      />
      <ViewDebtorsModal
        open={isViewDebtorsModalOpen}
        onClose={() => setViewDebtorsModalOpen(false)}
        debtors={debtors || []}
      />
      <ViewCreditorsModal // This would be a copy of ViewDebtorsModal, styled for creditors
        open={isViewCreditorsModalOpen}
        onClose={() => setViewCreditorsModalOpen(false)}
        creditors={creditors || []}
      />
      <LedgerCreatorModal
        open={isCreatorModalOpen}
        onClose={() => setCreatorModalOpen(false)}
      />
    </>
  )
}

export default LedgerSnapshot
