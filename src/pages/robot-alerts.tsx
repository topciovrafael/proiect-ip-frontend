"use client";

import { useState, useEffect } from "react";
import { AlertTriangle, Clock, CheckCircle, RefreshCw } from "lucide-react";

interface RobotAlert {
  ID_alarma: number;
  tip_alarma: string;
  descriere: string;
  data_ora: string;
  status: string;
  ID_comanda: number;
}

const RobotAlertsPage = () => {
  const [alerts, setAlerts] = useState<RobotAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      // Using relative URL to avoid CORS issues
      const response = await fetch("/api/alarme");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setAlerts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch alerts");
      console.error("Error fetching alerts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "noua":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
            <AlertTriangle className="w-3 h-3" />
            Nouă
          </span>
        );
      case "in_progres":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
            <Clock className="w-3 h-3" />
            În progres
          </span>
        );
      case "rezolvata":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
            <CheckCircle className="w-3 h-3" />
            Rezolvată
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

  const getAlertIcon = (tipAlarma: string) => {
    if (tipAlarma === "EROARE_ROBOT") {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
    return <AlertTriangle className="w-5 h-5 text-orange-600" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ro-RO", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const robotErrors = alerts.filter(
    (alert) => alert.tip_alarma === "EROARE_ROBOT"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2 text-gray-600">
            <RefreshCw className="w-5 h-5 animate-spin" />
            <span>Se încarcă alertele...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Alerte Robot</h1>
          <p className="text-gray-600">
            Monitorizarea erorilor și alertelor sistemului robot
          </p>
        </div>
        <button
          onClick={fetchAlerts}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizează
        </button>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-800">
                Eroare la încărcarea alertelor: {error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="rounded border border-gray-300 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="font-semibold">Lista Alerte Robot</h2>
        </div>

        {robotErrors.length === 0 ? (
          <div className="p-12 flex items-center justify-center">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                Nu există alerte active
              </h3>
              <p className="text-gray-600">
                Sistemul robot funcționează normal. Nu au fost detectate erori.
              </p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {robotErrors.map((alert) => (
              <div
                key={alert.ID_alarma}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {getAlertIcon(alert.tip_alarma)}
                    <div>
                      <h3 className="text-lg font-semibold">
                        Eroare Robot #{alert.ID_alarma}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                        <span>Comandă ID: {alert.ID_comanda}</span>
                        <span>•</span>
                        <span>{formatDate(alert.data_ora)}</span>
                      </div>
                    </div>
                  </div>
                  {getStatusBadge(alert.status)}
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium text-sm text-gray-600 mb-1">
                      Descriere eroare:
                    </h4>
                    <p className="text-sm bg-gray-100 p-3 rounded-md border border-gray-300">
                      {alert.descriere || "Nu există descriere disponibilă"}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>Tip: {alert.tip_alarma}</span>
                    <span>•</span>
                    <span>ID Alarmă: {alert.ID_alarma}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {robotErrors.length > 0 && (
        <div className="text-center text-sm text-gray-500 mt-4">
          Total alerte robot: {robotErrors.length}
        </div>
      )}
    </div>
  );
};

export default RobotAlertsPage;
