import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Toaster } from "sonner";
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Pages and Components
import { AuthPage } from "./pages/AuthPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import MainLayout from "./pages/MainLayout"; // New
import DashboardPage from "./pages/DashboardPage";
import ExpensesPage from "./pages/ExpensesPage"; // New
import LedgerPage from "./pages/LedgerPage";   // New
import InsightsPage from "./pages/InsightsPage"; // New

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Toaster richColors position="top-right" />
      <BrowserRouter>
        <Routes>
          {/* Public Route for Login/Signup */}
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Route now wraps our Main Layout */}
          <Route element={<ProtectedRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/expenses" element={<ExpensesPage />} />
              <Route path="/ledger" element={<LedgerPage />} />
              <Route path="/insights" element={<InsightsPage />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;