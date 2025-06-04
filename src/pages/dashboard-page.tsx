import type React from "react";
import SquareCard from "../components/SquareCard";
import type { User } from "../App";
import { Link } from "react-router-dom";

interface Props {
  user: User;
}

const DashboardPage: React.FC<Props> = ({ user }) => {
  /* Define which squares each role gets */
  const roleMap: Record<string, { label: string; to: string }[]> = {
    Medic: [
      { label: "Adaugă Pacient", to: "/add-patient" },
      { label: "Alocare Paturi", to: "/patients" },
      { label: "Medicatie\nPrescriptii", to: "/prescriptions-prep" },
      { label: "Istoric Transport", to: "/transport-history" },
      { label: "Alerte Roboti", to: "/robot-alerts" },
    ],
    Receptionist: [
      { label: "Adăugare pacient", to: "/add-patient" },
      { label: "Alocare paturi\nși saloane", to: "/patients" },
    ],
    Farmacist: [
      { label: "Gestionare\nmedicamente", to: "/medication-management" },
      { label: "Prescripții și\npregătire comenzi", to: "/prescriptions-prep" },
      // { label: "Stocuri", to: "/inventory" },
    ],
    Administrator: [
      { label: "Administrare\nutilizatori", to: "/user-administration" },
      { label: "Editare hartă\nspital", to: "/hospital-map" },
    ],
  };

  const handleLogout = () => {
    window.location.reload();
  };

  const squares = roleMap[user.rol] ?? [];

  return (
    <main className="min-h-screen bg-white p-8">
      <div>
        <img
          src="src/assets/medigo.png"
          alt="Medigo Logo"
          className="mx-auto mb-4 h-30 w-auto"
        />

        <h1 className="mb-6 text-2xl font-bold text-gray-800">
          Bine ai venit, {user.nume} {user.prenume}
        </h1>
        <button
          onClick={handleLogout}
          className="inline-flex items-center justify-center rounded-md w-[85px] h-[40px] px-8 py-4 text-lg font-medium text-blue-500 shadow-sm transition-all hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 mb-6"
        >
          Log out
        </button>
      </div>
      {squares.length === 0 ? (
        <p className="text-gray-600">
          Nu există pagini definite pentru rolul „{user.rol}".
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {squares.map((sq) => (
            <SquareCard key={sq.to} to={sq.to} label={sq.label} />
          ))}
        </div>
      )}
    </main>
  );
};

export default DashboardPage;
