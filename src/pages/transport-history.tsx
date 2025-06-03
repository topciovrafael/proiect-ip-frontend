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
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 text-gray-900">
      {/* Header - Responsive layout */}
      <div className="mb-4 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-bold">
              Istoric Transporturi
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Vizualizarea istoricului transporturilor de medicamente
            </p>
          </div>
          <div className="flex-shrink-0">
            <button
              onClick={fetchTransports}
              className="inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-3 sm:px-4 py-2 text-sm font-medium text-black hover:bg-blue-700 w-full sm:w-auto"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Actualizează</span>
            </button>
          </div>
        </div>
      </div>

      {/* Search - Responsive width */}
      <div className="mb-4 sm:mb-6">
        <div className="relative w-full sm:max-w-md">
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
        <div className="mb-4 sm:mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Transport history list */}
      {loading ? (
        <div className="flex items-center justify-center gap-2 text-gray-600 py-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Se încarcă...</span>
        </div>
      ) : (
        <div className="rounded border border-gray-300 bg-white overflow-hidden">
          <div className="border-b border-gray-200 px-3 sm:px-6 py-3 sm:py-4">
            <h2 className="font-semibold text-sm sm:text-base">
              Lista Transporturi
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th className="px-3 sm:px-6 py-3 text-left whitespace-nowrap">
                    ID Transport
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left whitespace-nowrap">
                    ID Medicament
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left whitespace-nowrap">
                    ID Pacient
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left whitespace-nowrap">
                    Data și Ora
                  </th>
                  <th className="px-3 sm:px-6 py-3 text-left whitespace-nowrap">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTransports.map((transport) => (
                  <tr key={transport.ID_transport} className="hover:bg-gray-50">
                    <td className="px-3 sm:px-6 py-3 font-medium whitespace-nowrap">
                      {transport.ID_transport}
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 whitespace-nowrap">
                        <Pill className="w-3 h-3" />
                        {transport.ID_medicament}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-purple-100 text-purple-800 whitespace-nowrap">
                        <User className="w-3 h-3" />
                        {transport.ID_pacient}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3 whitespace-nowrap text-xs sm:text-sm">
                      {formatDateTime(transport.data_ora)}
                    </td>
                    <td className="px-3 sm:px-6 py-3">
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

      {/* Summary - Responsive grid */}
      {filteredTransports.length > 0 && (
        <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
          <div className="rounded border border-gray-300 bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">
                  Total transporturi
                </p>
                <p className="text-base sm:text-lg font-semibold">
                  {filteredTransports.length}
                </p>
              </div>
            </div>
          </div>
          <div className="rounded border border-gray-300 bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">Finalizate</p>
                <p className="text-base sm:text-lg font-semibold">
                  {
                    filteredTransports.filter(
                      (t) => t.status.toLowerCase() === "finalizat"
                    ).length
                  }
                </p>
              </div>
            </div>
          </div>
          <div className="rounded border border-gray-300 bg-white p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-xs sm:text-sm text-gray-600">În curs</p>
                <p className="text-base sm:text-lg font-semibold">
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
