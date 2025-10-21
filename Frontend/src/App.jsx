import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// --- Pages & Components ---
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import MainLayout from "./pages/MainLayout";
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage";
import LedgerPage from "./pages/LedgerPage";
import LedgerHistoryPage from "./pages/LedgerHistoryPage";
import InsightsPage from "./pages/InsightsPage";

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* --- Public Route (Auth) --- */}
          <Route path="/auth" element={<AuthPage />} />

          {/* --- Protected Routes --- */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/ledger" element={<LedgerPage />} />
              <Route path="/insights" element={<InsightsPage />} />
            </Route>

            <Route path="/ledger/:personName" element={<LedgerHistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
