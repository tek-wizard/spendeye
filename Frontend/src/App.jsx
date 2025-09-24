import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { Toaster } from "sonner"
import { BrowserRouter, Routes, Route } from "react-router-dom"

// Import Pages and Components
import DashboardPage from "./pages/DashboardPage"
import { AuthPage } from "./pages/AuthPage"
import { ProtectedRoute } from "./components/auth/ProtectedRoute"

function App() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Toaster richColors position="top-right" />

      <BrowserRouter>
        <Routes>
          {/* Public Route for Login/Signup */}

          <Route path="/auth" element={<AuthPage />} />

          {/* Protected Routes */}

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<DashboardPage />} />

            {/* You can add more protected routes here later, e.g., /settings */}
          </Route>
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export default App
