"use client";

import { useState, useEffect } from "react";
import {
  Search,
  RefreshCw,
  Loader2,
  AlertTriangle,
  Truck,
  Calendar,
  User,
  Pill,
} from "lucide-react";

interface TransportHistory {
  ID_transport: number;
  ID_medicament: number;
  ID_pacient: number;
  data_ora: string;
  status: string;
}

const TransportHistoryPage = () => {
  const [transports, setTransports] = useState<TransportHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // Fetch transport history on component mount
  useEffect(() => {
    fetchTransports();
  }, []);

  // Fetch transport history from API
  const fetchTransports = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/istoric-transporturi");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTransports(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch transport history"
      );
      console.error("Error fetching transport history:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter transports based on search term
  const filteredTransports = transports.filter((transport) =>
    `${transport.ID_transport} ${transport.ID_medicament} ${transport.ID_pacient} ${transport.status}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Format datetime for display
  const formatDateTime = (dateTimeString: string) => {
    return new Date(dateTimeString).toLocaleString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "in_curs":
      case "in curs":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Truck className="w-3 h-3" />
            În curs
          </span>
        );
      case "finalizat":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <Calendar className="w-3 h-3" />
            Finalizat
          </span>
        );
      case "anulat":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            Anulat
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-300">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Istoric Transporturi</h1>
          <p className="text-gray-600">
            Vizualizarea istoricului transporturilor de medicamente
          </p>
        </div>
        <button
          onClick={fetchTransports}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizează
        </button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Caută transport..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Transport history list */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" /> Se încarcă...
        </div>
      ) : (
        <div className="rounded border border-gray-300 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold">Lista Transporturi</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th className="px-6 py-3 text-left">ID Transport</th>
                  <th className="px-6 py-3 text-left">ID Medicament</th>
                  <th className="px-6 py-3 text-left">ID Pacient</th>
                  <th className="px-6 py-3 text-left">Data și Ora</th>
                  <th className="px-6 py-3 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransports.map((transport) => (
                  <tr key={transport.ID_transport} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">
                      {transport.ID_transport}
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                        <Pill className="w-3 h-3" />
                        {transport.ID_medicament}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-purple-100 text-purple-800">
                        <User className="w-3 h-3" />
                        {transport.ID_pacient}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {formatDateTime(transport.data_ora)}
                    </td>
                    <td className="px-6 py-3">
                      {getStatusBadge(transport.status)}
                    </td>
                  </tr>
                ))}
                {!filteredTransports.length && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Nu au fost găsite transporturi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary */}
      {filteredTransports.length > 0 && (
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded border border-gray-300 bg-white p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total transporturi</p>
                <p className="text-lg font-semibold">
                  {filteredTransports.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded border border-gray-300 bg-white p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Finalizate</p>
                <p className="text-lg font-semibold">
                  {
                    filteredTransports.filter(
                      (t) => t.status.toLowerCase() === "finalizat"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="rounded border border-gray-300 bg-white p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">În curs</p>
                <p className="text-lg font-semibold">
                  {
                    filteredTransports.filter(
                      (t) =>
                        t.status.toLowerCase() === "in_curs" ||
                        t.status.toLowerCase() === "in curs"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransportHistoryPage;
