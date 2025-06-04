"use client";

import { useState, useEffect } from "react";
import {
  RefreshCw,
  Loader2,
  AlertTriangle,
  Save,
  Edit3,
  Eye,
  MapPin,
} from "lucide-react";

const HospitalMap = () => {
  const [matrix, setMatrix] = useState<boolean[][]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch map data on component mount
  useEffect(() => {
    fetchMapData();
  });

  // Fetch hospital map data from API
  const fetchMapData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/harta-spital");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.length > 0) {
        // Convert binary strings to matrix
        setMatrix(binaryToMatrix(data[0].nr1, data[0].nr2));
      } else {
        // Initialize with empty data if no records exist
        const emptyData = { nr1: "0".repeat(128), nr2: "0".repeat(128) };
        setMatrix(binaryToMatrix(emptyData.nr1, emptyData.nr2));
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch hospital map"
      );
      console.error("Error fetching hospital map:", err);
      // Initialize with empty matrix on error
      setMatrix(initializeMatrix());
    } finally {
      setLoading(false);
    }
  };

  // Initialize 16x16 matrix
  const initializeMatrix = () => {
    return Array(16)
      .fill(null)
      .map(() => Array(16).fill(false));
  };

  // Convert binary strings to matrix
  const binaryToMatrix = (nr1: string, nr2: string) => {
    const newMatrix = initializeMatrix();

    // Ensure strings are 128 characters long
    const binary1 = nr1.padEnd(128, "0").substring(0, 128);
    const binary2 = nr2.padEnd(128, "0").substring(0, 128);

    // Fill first 8 rows with nr1 (128 bits = 8 rows × 16 cols)
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 16; j++) {
        const bitIndex = i * 16 + j;
        newMatrix[i][j] = binary1[bitIndex] === "1";
      }
    }

    // Fill last 8 rows with nr2 (128 bits = 8 rows × 16 cols)
    for (let i = 8; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        const bitIndex = (i - 8) * 16 + j;
        newMatrix[i][j] = binary2[bitIndex] === "1";
      }
    }

    return newMatrix;
  };

  // Convert matrix to binary strings
  const matrixToBinary = (matrix: boolean[][]) => {
    let nr1 = "";
    let nr2 = "";

    // First 8 rows to nr1
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 16; j++) {
        nr1 += matrix[i][j] ? "1" : "0";
      }
    }

    // Last 8 rows to nr2
    for (let i = 8; i < 16; i++) {
      for (let j = 0; j < 16; j++) {
        nr2 += matrix[i][j] ? "1" : "0";
      }
    }

    return { nr1, nr2 };
  };

  // Handle cell click
  const handleCellClick = (row: number, col: number) => {
    if (!editMode) return;

    const newMatrix = [...matrix];
    newMatrix[row][col] = !newMatrix[row][col];
    setMatrix(newMatrix);
  };

  // Save matrix to database
  const handleSave = async () => {
    setSaving(true);
    try {
      const { nr1, nr2 } = matrixToBinary(matrix);

      const response = await fetch("/api/harta-spital", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nr1, nr2 }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to save hospital map");
      }

      setEditMode(false);
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save hospital map"
      );
      console.error("Error saving hospital map:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-6 text-gray-900">
      {/* Header - Responsive layout */}
      <div className="mb-4 sm:mb-6">
        <div className="mb-4">
          <h1 className="text-xl sm:text-2xl font-bold">Harta Spital</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1">
            Vizualizarea și editarea hărții spitalului
          </p>
        </div>

        {/* Buttons - Stack on mobile, inline on larger screens */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-2">
          <button
            onClick={fetchMapData}
            className="inline-flex items-center justify-center gap-2 rounded bg-gray-600 px-3 py-2 text-sm font-medium text-black hover:bg-gray-700 w-full sm:w-auto"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="sm:inline">Actualizează</span>
          </button>

          <button
            onClick={() => setEditMode(!editMode)}
            className={`inline-flex items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium text-black w-full sm:w-auto ${
              editMode
                ? "bg-orange-600 hover:bg-orange-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {editMode ? (
              <Eye className="w-4 h-4" />
            ) : (
              <Edit3 className="w-4 h-4" />
            )}
            <span>{editMode ? "Vizualizare" : "Editare"}</span>
          </button>

          {editMode && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded bg-green-600 px-3 py-2 text-sm font-medium text-black hover:bg-green-700 disabled:opacity-70 w-full sm:w-auto"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Se salvează...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Salvează</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Edit mode indicator - Better mobile layout */}
      {editMode && (
        <div className="mb-4 rounded-md bg-orange-50 border border-orange-200 p-3">
          <div className="flex items-start gap-2">
            <Edit3 className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-orange-800 leading-relaxed">
              Mod editare activ. Atingeți celulele pentru a le activa/dezactiva.
            </p>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mb-4 sm:mb-6 rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 leading-relaxed">{error}</p>
          </div>
        </div>
      )}

      {/* Hospital Map Matrix */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600 justify-center py-8">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>Se încarcă harta...</span>
        </div>
      ) : (
        <div className="rounded border border-gray-300 bg-white p-3 sm:p-6">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-blue-600" />
            <h2 className="font-semibold text-sm sm:text-base">
              Harta Spital (16x16)
            </h2>
          </div>

          {/* Responsive grid container */}
          <div className="w-full overflow-x-auto">
            <div className="flex justify-center min-w-fit">
              <div className="inline-grid grid-cols-16 gap-0.5 sm:gap-px bg-gray-400 p-0.5 sm:p-px border border-gray-400 rounded">
                {matrix.map((row, rowIndex) =>
                  row.map((cell, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-4 h-4 sm:w-6 sm:h-6 border border-gray-300
                        ${cell ? "bg-gray-800" : "bg-gray-200"}
                        ${
                          editMode
                            ? "cursor-pointer hover:opacity-80 active:scale-95"
                            : ""
                        }
                        transition-all duration-150
                      `}
                      onClick={() => handleCellClick(rowIndex, colIndex)}
                      title={`Poziția [${rowIndex + 1}, ${colIndex + 1}]`}
                    />
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Legend - Responsive layout */}
          <div className="mt-4 sm:mt-6 flex justify-center">
            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-200 border border-gray-300"></div>
                <span className="text-gray-600">Liber (0)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-800 border border-gray-300"></div>
                <span className="text-gray-600">Ocupat (1)</span>
              </div>
            </div>
          </div>

          {/* Statistics - Responsive grid */}
          <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3">
            <div className="rounded border border-gray-300 bg-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Total celule
                  </p>
                  <p className="text-base sm:text-lg font-semibold">256</p>
                </div>
              </div>
            </div>
            <div className="rounded border border-gray-300 bg-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-800 border border-gray-300 flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Celule ocupate
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {matrix.flat().filter(Boolean).length}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded border border-gray-300 bg-gray-100 p-3 sm:p-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-200 border border-gray-300 flex-shrink-0"></div>
                <div className="min-w-0">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Celule libere
                  </p>
                  <p className="text-base sm:text-lg font-semibold">
                    {matrix.flat().filter((cell) => !cell).length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalMap;
