import React, { JSX, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/dashboard-page";
import PatientsPage from "./pages/patients";
import LoginPage from "./pages/login";

import "./App.css";

export interface User {
  id: number;
  email: string;
  nume: string;
  prenume: string;
  rol: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (u: User) => setUser(u);

  const PrivateRoute = ({ element }: { element: JSX.Element }) =>
    user ? element : <Navigate to="/login" replace />;

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={<PrivateRoute element={<DashboardPage />} />}
        />
        <Route
          path="/patients"
          element={<PrivateRoute element={<PatientsPage />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
