"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Edit, FileText, Loader2, Search, X, Check, Plus } from "lucide-react";

/* ─────────────── types & helpers ─────────────── */
interface Medication {
  ID_medicament: number;
  denumire: string;
  descriere: string | null;
  RFID: string | null;
  stoc_curent: number;
}

// New medication template
const emptyMedication: Omit<Medication, "ID_medicament"> = {
  denumire: "",
  descriere: null,
  RFID: null,
  stoc_curent: 0,
};

/* ─────────────── component ─────────────── */
export default function MedicationManagementPage() {
  /* list state */
  const [rows, setRows] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ui state */
  const [search, setSearch] = useState("");
  const [view, setView] = useState<Medication | null>(null);
  const [edit, setEdit] = useState<Medication | null>(null);
  const [add, setAdd] = useState<Omit<Medication, "ID_medicament"> | null>(
    null
  );

  /* form helpers */
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  /* load once */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<Medication[]>("/api/medicamente");
        setRows(data);
      } catch {
        setError("Failed to load medications.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* search filter */
  const filtered = rows.filter((m) =>
    `${m.ID_medicament} ${m.denumire} ${m.descriere || ""}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ───────── edit save ───────── */
  const saveEdit = async () => {
    if (!edit) return;
    const errs: Record<string, string> = {};
    if (!edit.denumire.trim()) errs.denumire = "Denumirea este obligatorie";
    if (edit.stoc_curent < 0) errs.stoc_curent = "Stocul nu poate fi negativ";

    setFieldErr(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await axios.put(`/api/medications/${edit.ID_medicament}`, edit);
      setRows((prev) =>
        prev.map((m) => (m.ID_medicament === edit.ID_medicament ? edit : m))
      );
      setEdit(null);
    } catch {
      setFieldErr({ global: "Eroare la salvare – încercați din nou." });
    } finally {
      setSaving(false);
    }
  };

  /* ───────── add save ───────── */
  const saveAdd = async () => {
    if (!add) return;
    const errs: Record<string, string> = {};
    if (!add.denumire.trim()) errs.denumire = "Denumirea este obligatorie";
    if (add.stoc_curent < 0) errs.stoc_curent = "Stocul nu poate fi negativ";

    setFieldErr(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await axios.post("/api/medications", add);
      // Refresh the list to get the new ID
      const response = await axios.get<Medication[]>("/api/medicamente");
      setRows(response.data);
      setAdd(null);
    } catch {
      setFieldErr({ global: "Eroare la adăugare – încercați din nou." });
    } finally {
      setSaving(false);
    }
  };

  /* ───────── render ───────── */
  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <h1 className="mb-6 text-2xl font-bold">Medicamente</h1>

      {/* search and add button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Caută medicament..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setAdd({ ...emptyMedication })}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Adaugă medicament
        </button>
      </div>

      {/* list */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" /> Se încarcă...
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="rounded border border-gray-300 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold">Lista Medicamente</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Denumire</th>
                  <th className="px-6 py-3 text-left">Stoc Curent</th>
                  <th className="px-6 py-3 text-left">RFID</th>
                  <th className="px-6 py-3 text-left">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((m) => (
                  <tr key={m.ID_medicament} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{m.ID_medicament}</td>
                    <td className="px-6 py-3">{m.denumire}</td>
                    <td className="px-6 py-3">{m.stoc_curent}</td>
                    <td className="px-6 py-3">{m.RFID || "-"}</td>
                    <td className="px-6 py-3">
                      <button
                        title="View"
                        onClick={() => setView(m)}
                        className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => setEdit({ ...m })}
                        className="ml-2 rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Nu au fost găsite medicamente.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────── view details modal ───────── */}
      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Medicament #{view.ID_medicament} – {view.denumire}
              </h2>
              <button
                onClick={() => setView(null)}
                className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-600">Denumire</p>
                <p>{view.denumire}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Stoc Curent</p>
                <p>{view.stoc_curent}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">RFID</p>
                <p>{view.RFID ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Descriere</p>
                <p>{view.descriere ?? "-"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────── edit modal ───────── */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Editează medicament #{edit.ID_medicament}
              </h2>
              <button
                onClick={() => setEdit(null)}
                className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">
                  Denumire <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded border ${
                    fieldErr.denumire ? "border-red-500" : "border-gray-300"
                  } bg-white p-2`}
                  value={edit.denumire}
                  onChange={(e) =>
                    setEdit({ ...edit, denumire: e.target.value })
                  }
                />
                {fieldErr.denumire && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErr.denumire}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700">Descriere</label>
                <textarea
                  className="w-full rounded border border-gray-300 bg-white p-2"
                  value={edit.descriere ?? ""}
                  onChange={(e) =>
                    setEdit({ ...edit, descriere: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">RFID</label>
                  <input
                    className="w-full rounded border border-gray-300 bg-white p-2"
                    value={edit.RFID ?? ""}
                    onChange={(e) => setEdit({ ...edit, RFID: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Stoc Curent <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className={`w-full rounded border ${
                      fieldErr.stoc_curent
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-white p-2`}
                    value={edit.stoc_curent}
                    onChange={(e) =>
                      setEdit({
                        ...edit,
                        stoc_curent: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  {fieldErr.stoc_curent && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErr.stoc_curent}
                    </p>
                  )}
                </div>
              </div>

              {fieldErr.global && (
                <p className="text-red-500">{fieldErr.global}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEdit(null)}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                disabled={saving}
                onClick={saveEdit}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Se salvează...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Salvează
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────── add modal ───────── */}
      {add && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Adaugă medicament nou</h2>
              <button
                onClick={() => setAdd(null)}
                className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-700">
                  Denumire <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded border ${
                    fieldErr.denumire ? "border-red-500" : "border-gray-300"
                  } bg-white p-2`}
                  value={add.denumire}
                  onChange={(e) => setAdd({ ...add, denumire: e.target.value })}
                />
                {fieldErr.denumire && (
                  <p className="mt-1 text-xs text-red-500">
                    {fieldErr.denumire}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-700">Descriere</label>
                <textarea
                  className="w-full rounded border border-gray-300 bg-white p-2"
                  value={add.descriere ?? ""}
                  onChange={(e) =>
                    setAdd({ ...add, descriere: e.target.value })
                  }
                  rows={3}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">RFID</label>
                  <input
                    className="w-full rounded border border-gray-300 bg-white p-2"
                    value={add.RFID ?? ""}
                    onChange={(e) => setAdd({ ...add, RFID: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Stoc Inițial <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    className={`w-full rounded border ${
                      fieldErr.stoc_curent
                        ? "border-red-500"
                        : "border-gray-300"
                    } bg-white p-2`}
                    value={add.stoc_curent}
                    onChange={(e) =>
                      setAdd({
                        ...add,
                        stoc_curent: Number.parseInt(e.target.value) || 0,
                      })
                    }
                  />
                  {fieldErr.stoc_curent && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErr.stoc_curent}
                    </p>
                  )}
                </div>
              </div>

              {fieldErr.global && (
                <p className="text-red-500">{fieldErr.global}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setAdd(null)}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                disabled={saving}
                onClick={saveAdd}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Se adaugă...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4" /> Adaugă
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
