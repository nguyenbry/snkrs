import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Register from "./comps/register/Register";
import Settings from "./comps/settings/Settings";
import Login from "./comps/login/Login";
import Dashboard from "./comps/dashboard/Dashboard";
import { AuthProvider } from "./comps/auth/AuthContext";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />m s
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
