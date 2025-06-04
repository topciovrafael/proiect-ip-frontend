import { JSX, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import DashboardPage from "./pages/dashboard-page";
import PatientsPage from "./pages/patients";
import LoginPage from "./pages/login";

/* placeholder pages – add real content later */
import AddPatientPage from "./pages/add-patient";
// import BedAllocationPage from "./pages/bed-allocation";
import MedicationPrescriptionsPage from "./pages/medication-prescriptions";

import TransportHistoryPage from "./pages/transport-history";
import RobotAlertsPage from "./pages/robot-alerts";
import MedicationManagementPage from "./pages/medication-management";
// import PrescriptionsPrepPage from "./pages/prescriptions-prep";
// import InventoryPage from "./pages/inventory";

import "./App.css";
import UserAdministration from "./pages/user-administration";
import HospitalMap from "./pages/hospital-map";

export interface User {
  id: number;
  email: string;
  nume: string;
  prenume: string;
  rol: string; // e.g. "Medic", "Farmacist", etc.
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

        {/* Protected area */}
        <Route
          path="/"
          element={<PrivateRoute element={<DashboardPage user={user!} />} />}
        />
        <Route
          path="/patients"
          element={<PrivateRoute element={<PatientsPage />} />}
        />

        {/* Doctor pages */}
        <Route
          path="/add-patient"
          element={<PrivateRoute element={<AddPatientPage />} />}
        />
        <Route
          path="/bed-allocation"
          // momentan
          element={<PrivateRoute element={<PatientsPage />} />}
        />
        <Route
          path="/medication-prescriptions"
          element={<PrivateRoute element={<MedicationPrescriptionsPage />} />}
        />
        <Route
          path="/transport-history"
          element={<PrivateRoute element={<TransportHistoryPage />} />}
        />
        <Route
          path="/robot-alerts"
          element={<PrivateRoute element={<RobotAlertsPage />} />}
        />

        {/* Pharmacist pages */}
        <Route
          path="/medication-management"
          element={<PrivateRoute element={<MedicationManagementPage />} />}
        />
        <Route
          path="/prescriptions-prep"
          element={<PrivateRoute element={<MedicationPrescriptionsPage />} />}
        />
        {/* <Route
          path="/inventory"
          element={<PrivateRoute element={<InventoryPage />} />}
        /> */}

        <Route
          path="/user-administration"
          element={<PrivateRoute element={<UserAdministration />} />}
        />
        <Route
          path="/hospital-map"
          element={<PrivateRoute element={<HospitalMap />} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
