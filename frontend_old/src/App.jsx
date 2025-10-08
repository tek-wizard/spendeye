// App.jsx
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import HomePage from "./pages/Home"; // <-- Import the new page
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Add the new Home route WITHOUT the AuthLayout */}
          <Route path="/" element={<HomePage />} />

          {/* Auth pages wrapped in AuthLayout */}
          <Route
            path="/login"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <AuthLayout>
                <SignupPage />
              </AuthLayout>
            }
          />

          {/* Optional: redirect to login if route not found */}
          <Route
            path="*"
            element={
              <AuthLayout>
                <LoginPage />
              </AuthLayout>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;