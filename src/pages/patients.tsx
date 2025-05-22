"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Edit,
  FileText,
  Loader2,
  Search, // ⬅︎ delete icon no longer used
  /* Trash2, */ X,
  Check, // ⬅︎ delete modal removed
} from /* AlertCircle, */ "lucide-react";

/* ─────────────── types & helpers ─────────────── */
interface Patient {
  id: number;
  nume: string;
  prenume: string;
  CNP: string;
  adresa: string | null;
  telefon: string | null;
  salon: string | null;
  pat: string | null;
}

const room = (p: Patient) =>
  p.salon ? `${p.salon}${p.pat ? ` / ${p.pat}` : ""}` : "-";

const roPhone = /^(07|02|03)\d{8}$/;
const validateCNP = (cnp: string): string | null => {
  if (!/^\d{13}$/.test(cnp)) return "CNP-ul trebuie să aibă 13 cifre.";
  const ctrl =
    "279146358279".split("").reduce((s, n, i) => s + +cnp[i] * +n, 0) % 11;
  const chk = ctrl === 10 ? 1 : ctrl;
  return chk !== +cnp[12] ? "CNP invalid – cifra de control greșită." : null;
};

/* ─────────────── component ─────────────── */
export default function PatientsPage() {
  /* list state */
  const [rows, setRows] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ui state */
  const [search, setSearch] = useState("");
  const [view, setView] = useState<Patient | null>(null);
  const [edit, setEdit] = useState<Patient | null>(null);

  /* edit form helpers */
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  /* load once */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get<Patient[]>("/api/patients");
        setRows(data);
      } catch {
        setError("Failed to load patients.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* search filter */
  const filtered = rows.filter((p) =>
    `${p.id} ${p.nume} ${p.prenume} ${room(p)}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* ───────── edit save ───────── */
  const saveEdit = async () => {
    if (!edit) return;
    const errs: Record<string, string> = {};
    if (!edit.nume.trim()) errs.nume = "Numele este obligatoriu";
    if (!edit.prenume.trim()) errs.prenume = "Prenumele este obligatoriu";
    if (!edit.CNP.trim()) errs.CNP = "CNP-ul este obligatoriu";
    else {
      const msg = validateCNP(edit.CNP.trim());
      if (msg) errs.CNP = msg;
    }
    if (edit.telefon && !roPhone.test(edit.telefon))
      errs.telefon = "Telefon românesc invalid";

    setFieldErr(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      await axios.put(`/api/patients/${edit.id}`, edit);
      setRows((prev) => prev.map((p) => (p.id === edit.id ? edit : p)));
      setEdit(null);
    } catch {
      setFieldErr({ global: "Eroare la salvare – încercați din nou." });
    } finally {
      setSaving(false);
    }
  };

  /* ───────── render ───────── */
  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <h1 className="mb-6 text-2xl font-bold">Pacienti</h1>

      {/* search */}
      <div className="relative mb-6 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* list */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="rounded border border-gray-800 bg-gray-950">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="font-semibold">Patient List</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-xs uppercase text-gray-400">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Nume / Prenume</th>
                  <th className="px-6 py-3 text-left">Salon / Pat</th>
                  <th className="px-6 py-3 text-left">Actiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-900">
                    <td className="px-6 py-3 font-medium">{p.id}</td>
                    <td className="px-6 py-3">
                      {p.nume} {p.prenume}
                    </td>
                    <td className="px-6 py-3">{room(p)}</td>
                    <td className="px-6 py-3">
                      <button
                        title="View"
                        onClick={() => setView(p)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                      <button
                        title="Edit"
                        onClick={() => setEdit({ ...p })}
                        className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>

                      {/*  DELETE button intentionally disabled
                      <button
                        title="Delete"
                        onClick={() => setAskDel(p)}
                        className="ml-2 rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button> */}
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      Nu au fost gasiti pacienti.
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
          <div className="w-full max-w-xl rounded-lg bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Pacient #{view.id} – {view.nume} {view.prenume}
              </h2>
              <button
                onClick={() => setView(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">CNP</p>
                <p>{view.CNP}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Telefon</p>
                <p>{view.telefon ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Adresă</p>
                <p>{view.adresa ?? "-"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Salon / Pat</p>
                <p>{room(view)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────── edit modal ───────── */}
      {edit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-xl rounded-lg bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Editeaza pacient #{edit.id}</h2>
              <button
                onClick={() => setEdit(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* --- form fields (unchanged) --- */}
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {(["nume", "prenume"] as const).map((k) => (
                  <div key={k}>
                    <label className="block text-sm capitalize text-gray-400">
                      {k} <span className="text-red-500">*</span>
                    </label>
                    <input
                      className={`w-full rounded border ${
                        fieldErr[k] ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 p-2`}
                      value={edit[k]}
                      onChange={(e) =>
                        setEdit({ ...edit, [k]: e.target.value })
                      }
                    />
                    {fieldErr[k] && (
                      <p className="mt-1 text-xs text-red-500">{fieldErr[k]}</p>
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm text-gray-400">
                  CNP <span className="text-red-500">*</span>
                </label>
                <input
                  className={`w-full rounded border ${
                    fieldErr.CNP ? "border-red-500" : "border-gray-700"
                  } bg-gray-800 p-2`}
                  maxLength={13}
                  value={edit.CNP}
                  onChange={(e) => setEdit({ ...edit, CNP: e.target.value })}
                />
                {fieldErr.CNP && (
                  <p className="mt-1 text-xs text-red-500">{fieldErr.CNP}</p>
                )}
              </div>

              <div>
                <label className="block text-sm text-gray-400">Adresă</label>
                <input
                  className="w-full rounded border border-gray-700 bg-gray-800 p-2"
                  value={edit.adresa ?? ""}
                  onChange={(e) => setEdit({ ...edit, adresa: e.target.value })}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <label className="block text-sm text-gray-400">Telefon</label>
                  <input
                    className={`w-full rounded border ${
                      fieldErr.telefon ? "border-red-500" : "border-gray-700"
                    } bg-gray-800 p-2`}
                    value={edit.telefon ?? ""}
                    onChange={(e) =>
                      setEdit({ ...edit, telefon: e.target.value })
                    }
                    maxLength={10}
                  />
                  {fieldErr.telefon && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErr.telefon}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Salon</label>
                  <input
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2"
                    value={edit.salon ?? ""}
                    onChange={(e) =>
                      setEdit({ ...edit, salon: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400">Pat</label>
                  <input
                    className="w-full rounded border border-gray-700 bg-gray-800 p-2"
                    value={edit.pat ?? ""}
                    onChange={(e) => setEdit({ ...edit, pat: e.target.value })}
                  />
                </div>
              </div>

              {fieldErr.global && (
                <p className="text-red-500">{fieldErr.global}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEdit(null)}
                className="rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                disabled={saving}
                onClick={saveEdit}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Se salveaza...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Salveaza...
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/*
      ───────── delete confirm modal removed here ─────────
      askDel & related state kept only to avoid TS refactor,
      but UI / network call is gone.
      */}
    </div>
  );
}
