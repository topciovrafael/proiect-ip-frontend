"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { FileText, Loader2, Search, X, Check, Plus } from "lucide-react";

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

interface Medication {
  ID_medicament: number;
  denumire: string;
  descriere: string | null;
  RFID: string | null;
  stoc_curent: number;
}

interface Doctor {
  id: number;
  nume: string;
  prenume: string;
  rol: string;
  username: string;
  email: string;
  status: string;
}

interface Prescription {
  ID_prescriptie: number;
  ID_pacient: number;
  ID_medic: number;
  data_prescriptiei: string;
  patient_name: string;
  doctor_name: string;
}

interface PrescriptionMedication {
  ID_prescriptie: number;
  ID_medicament: number;
  doza: string;
  frecventa: string;
  medication_name: string;
  stoc_curent: number;
}

interface NewPrescription {
  ID_pacient: number;
  ID_medic: number;
  medications: {
    ID_medicament: number;
    doza: number; // in mg
    frecventa: number; // in days
  }[];
}

const MedicationPrescriptionsPage = () => {
  /* list state */
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ui state */
  const [search, setSearch] = useState("");
  const [view, setView] = useState<Prescription | null>(null);
  const [viewMedications, setViewMedications] = useState<
    PrescriptionMedication[]
  >([]);
  const [add, setAdd] = useState<NewPrescription | null>(null);

  /* form helpers */
  const [saving, setSaving] = useState(false);
  const [fieldErr, setFieldErr] = useState<Record<string, string>>({});

  /* load data */
  useEffect(() => {
    (async () => {
      try {
        const [prescriptionsRes, patientsRes, medicationsRes, doctorsRes] =
          await Promise.all([
            axios.get<Prescription[]>("/api/prescriptions"),
            axios.get<Patient[]>("/api/patients"),
            axios.get<Medication[]>("/api/medicamente"),
            axios.get<Doctor[]>("/api/utilizatori"),
          ]);

        setPrescriptions(prescriptionsRes.data);
        setPatients(patientsRes.data);
        setMedications(medicationsRes.data);
        setDoctors(doctorsRes.data.filter((u) => u.rol === "Medic"));
      } catch {
        setError("Failed to load data.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* search filter */
  const filtered = prescriptions.filter((p) =>
    `${p.ID_prescriptie} ${p.patient_name} ${p.doctor_name}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  /* view prescription details */
  const viewPrescription = async (prescription: Prescription) => {
    try {
      const { data } = await axios.get<PrescriptionMedication[]>(
        `/api/prescriptions/${prescription.ID_prescriptie}/medications`
      );
      setViewMedications(data);
      setView(prescription);
    } catch {
      setError("Failed to load prescription details.");
    }
  };

  /* add new medication to prescription */
  const addMedicationToPrescription = () => {
    if (!add) return;
    setAdd({
      ...add,
      medications: [
        ...add.medications,
        {
          ID_medicament: 0,
          doza: 100,
          frecventa: 1,
        },
      ],
    });
  };

  /* remove medication from prescription */
  const removeMedicationFromPrescription = (index: number) => {
    if (!add) return;
    setAdd({
      ...add,
      medications: add.medications.filter((_, i) => i !== index),
    });
  };

  /* update medication in prescription */
  const updateMedicationInPrescription = (
    index: number,
    field: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    value: any
  ) => {
    if (!add) return;
    const updatedMedications = [...add.medications];
    updatedMedications[index] = {
      ...updatedMedications[index],
      [field]: value,
    };
    setAdd({ ...add, medications: updatedMedications });
  };

  /* save prescription */
  const savePrescription = async () => {
    if (!add) return;
    const errs: Record<string, string> = {};

    if (!add.ID_pacient) errs.patient = "Selectați un pacient";
    if (!add.ID_medic) errs.doctor = "Selectați un medic";
    if (!add.medications.length)
      errs.medications = "Adăugați cel puțin un medicament";

    add.medications.forEach((med, index) => {
      if (!med.ID_medicament)
        errs[`med_${index}_id`] = "Selectați medicamentul";
      if (med.doza < 100 || med.doza > 1000)
        errs[`med_${index}_doza`] = "Doza trebuie să fie între 100-1000mg";
      if (med.frecventa < 1 || med.frecventa > 30)
        errs[`med_${index}_frecventa`] =
          "Frecvența trebuie să fie între 1-30 zile";
    });

    setFieldErr(errs);
    if (Object.keys(errs).length) return;

    setSaving(true);
    try {
      console.log("Sending prescription data:", add);
      const response = await axios.post("/api/prescriptions", add);
      console.log("Prescription response:", response.data);

      // Refresh prescriptions list
      const { data } = await axios.get<Prescription[]>("/api/prescriptions");
      setPrescriptions(data);
      setAdd(null);
    } catch (error) {
      console.error("Error saving prescription:", error);
      if (axios.isAxiosError(error) && error.response) {
        // If we have a specific error message from the server
        setFieldErr({ global: `Error: ${error.response.data}` });
      } else {
        setFieldErr({ global: "Eroare la salvare – încercați din nou." });
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 p-6 text-gray-200">
      <h1 className="mb-6 text-2xl font-bold">Prescripții Medicamente</h1>

      {/* search and add button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            className="w-full rounded-md border border-gray-700 bg-gray-800 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Caută prescripție..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() =>
            setAdd({
              ID_pacient: 0,
              ID_medic: 0,
              medications: [],
            })
          }
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Prescripție nouă
        </button>
      </div>

      {/* list */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-400">
          <Loader2 className="h-5 w-5 animate-spin" /> Se încarcă...
        </div>
      ) : error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="rounded border border-gray-800 bg-gray-950">
          <div className="border-b border-gray-800 px-6 py-4">
            <h2 className="font-semibold">Lista Prescripții</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-800 text-xs uppercase text-gray-400">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Pacient</th>
                  <th className="px-6 py-3 text-left">Medic</th>
                  <th className="px-6 py-3 text-left">Data</th>
                  <th className="px-6 py-3 text-left">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((p) => (
                  <tr key={p.ID_prescriptie} className="hover:bg-gray-900">
                    <td className="px-6 py-3 font-medium">
                      {p.ID_prescriptie}
                    </td>
                    <td className="px-6 py-3">{p.patient_name}</td>
                    <td className="px-6 py-3">{p.doctor_name}</td>
                    <td className="px-6 py-3">
                      {new Date(p.data_prescriptiei).toLocaleDateString(
                        "ro-RO"
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        title="View"
                        onClick={() => viewPrescription(p)}
                        className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
                      >
                        <FileText className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                {!filtered.length && (
                  <tr>
                    <td colSpan={5} className="p-4 text-center text-gray-500">
                      Nu au fost găsite prescripții.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ───────── view prescription modal ───────── */}
      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">
                Prescripție #{view.ID_prescriptie} – {view.patient_name}
              </h2>
              <button
                onClick={() => setView(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mb-6 grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm text-gray-400">Pacient</p>
                <p>{view.patient_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Medic</p>
                <p>{view.doctor_name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Data prescripției</p>
                <p>
                  {new Date(view.data_prescriptiei).toLocaleDateString("ro-RO")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-4 text-lg font-semibold">
                Medicamente prescrise
              </h3>
              <div className="space-y-3">
                {viewMedications.map((med, index) => (
                  <div
                    key={index}
                    className="rounded border border-gray-700 bg-gray-800 p-4"
                  >
                    <div className="grid gap-2 md:grid-cols-3">
                      <div>
                        <p className="text-sm text-gray-400">Medicament</p>
                        <p className="font-medium">{med.medication_name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Doză</p>
                        <p>{med.doza}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400">Frecvență</p>
                        <p>{med.frecventa}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ───────── add prescription modal ───────── */}
      {add && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-gray-900 p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Prescripție nouă</h2>
              <button
                onClick={() => setAdd(null)}
                className="rounded p-1 text-gray-400 hover:bg-gray-800 hover:text-gray-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Patient and Doctor Selection */}
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-400">
                    Pacient <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border ${
                      fieldErr.patient ? "border-red-500" : "border-gray-700"
                    } bg-gray-800 p-2`}
                    value={add.ID_pacient}
                    onChange={(e) =>
                      setAdd({ ...add, ID_pacient: +e.target.value })
                    }
                  >
                    <option value={0}>Selectați pacientul</option>
                    {patients.map((patient) => (
                      <option key={patient.id} value={patient.id}>
                        {patient.nume} {patient.prenume} - {patient.CNP}
                      </option>
                    ))}
                  </select>
                  {fieldErr.patient && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErr.patient}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm text-gray-400">
                    Medic <span className="text-red-500">*</span>
                  </label>
                  <select
                    className={`w-full rounded border ${
                      fieldErr.doctor ? "border-red-500" : "border-gray-700"
                    } bg-gray-800 p-2`}
                    value={add.ID_medic}
                    onChange={(e) =>
                      setAdd({ ...add, ID_medic: +e.target.value })
                    }
                  >
                    <option value={0}>Selectați medicul</option>
                    {doctors.map((doctor) => (
                      <option key={doctor.id} value={doctor.id}>
                        Dr. {doctor.nume} {doctor.prenume}
                      </option>
                    ))}
                  </select>
                  {fieldErr.doctor && (
                    <p className="mt-1 text-xs text-red-500">
                      {fieldErr.doctor}
                    </p>
                  )}
                </div>
              </div>

              {/* Medications */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Medicamente</h3>
                  <button
                    onClick={addMedicationToPrescription}
                    className="inline-flex items-center gap-2 rounded bg-green-600 px-3 py-1 text-sm hover:bg-green-700"
                  >
                    <Plus className="h-4 w-4" /> Adaugă medicament
                  </button>
                </div>

                {fieldErr.medications && (
                  <p className="mb-4 text-red-500">{fieldErr.medications}</p>
                )}

                <div className="space-y-4">
                  {add.medications.map((med, index) => (
                    <div
                      key={index}
                      className="rounded border border-gray-700 bg-gray-800 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-medium">Medicament #{index + 1}</h4>
                        <button
                          onClick={() =>
                            removeMedicationFromPrescription(index)
                          }
                          className="rounded p-1 text-red-400 hover:bg-gray-700"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-3">
                        <div>
                          <label className="block text-sm text-gray-400">
                            Medicament <span className="text-red-500">*</span>
                          </label>
                          <select
                            className={`w-full rounded border ${
                              fieldErr[`med_${index}_id`]
                                ? "border-red-500"
                                : "border-gray-700"
                            } bg-gray-700 p-2`}
                            value={med.ID_medicament}
                            onChange={(e) =>
                              updateMedicationInPrescription(
                                index,
                                "ID_medicament",
                                +e.target.value
                              )
                            }
                          >
                            <option value={0}>Selectați medicamentul</option>
                            {medications.map((medication) => (
                              <option
                                key={medication.ID_medicament}
                                value={medication.ID_medicament}
                              >
                                {medication.denumire} (Stoc:{" "}
                                {medication.stoc_curent})
                              </option>
                            ))}
                          </select>
                          {fieldErr[`med_${index}_id`] && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErr[`med_${index}_id`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400">
                            Doză (mg) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="100"
                            max="1000"
                            className={`w-full rounded border ${
                              fieldErr[`med_${index}_doza`]
                                ? "border-red-500"
                                : "border-gray-700"
                            } bg-gray-700 p-2`}
                            value={med.doza}
                            onChange={(e) =>
                              updateMedicationInPrescription(
                                index,
                                "doza",
                                +e.target.value
                              )
                            }
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            100-1000mg
                          </p>
                          {fieldErr[`med_${index}_doza`] && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErr[`med_${index}_doza`]}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm text-gray-400">
                            Frecvență (zile){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="30"
                            className={`w-full rounded border ${
                              fieldErr[`med_${index}_frecventa`]
                                ? "border-red-500"
                                : "border-gray-700"
                            } bg-gray-700 p-2`}
                            value={med.frecventa}
                            onChange={(e) =>
                              updateMedicationInPrescription(
                                index,
                                "frecventa",
                                +e.target.value
                              )
                            }
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            1-30 zile
                          </p>
                          {fieldErr[`med_${index}_frecventa`] && (
                            <p className="mt-1 text-xs text-red-500">
                              {fieldErr[`med_${index}_frecventa`]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {fieldErr.global && (
                <p className="text-red-500">{fieldErr.global}</p>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setAdd(null)}
                className="rounded border border-gray-700 bg-gray-800 px-4 py-2 text-sm hover:bg-gray-700"
              >
                Anulează
              </button>
              <button
                disabled={saving}
                onClick={savePrescription}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Se salvează...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Salvează prescripția
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicationPrescriptionsPage;
