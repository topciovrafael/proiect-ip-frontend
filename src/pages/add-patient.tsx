"use client";

import type React from "react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Simple custom components using only Tailwind - Dark Mode
const Card: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="bg-gray-900 rounded-lg shadow-lg border border-gray-800 border-t-4 border-t-blue-600">
    {children}
  </div>
);

const CardHeader: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-6 border-b border-gray-800">{children}</div>
);

const CardContent: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="p-6">{children}</div>
);

const CardFooter: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="px-6 py-4 bg-gray-950 rounded-b-lg flex justify-end">
    {children}
  </div>
);

const Button: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: "primary" | "outline";
  }
> = ({ children, variant = "primary", className = "", ...props }) => (
  <button
    className={`px-4 py-2 rounded-md font-medium transition-colors ${
      variant === "primary"
        ? "bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800"
        : "border border-gray-600 bg-gray-800 hover:bg-gray-700 text-gray-200 disabled:bg-gray-900"
    } disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Alert: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="bg-red-900/30 border-l-4 border-red-600 p-4 text-red-200 animate-[fadeIn_0.3s_ease-in-out]">
    {children}
  </div>
);

// Validation functions
const validateRomanianPhoneNumber = (phone: string): boolean => {
  // Romanian phone numbers:
  // - Mobile: 07xx xxx xxx (10 digits starting with 07)
  // - Fixed: 02x xxx xxxx or 03x xxx xxxx (10 digits starting with 02 or 03)
  const phoneRegex = /^(07|02|03)\d{8}$/;
  return phoneRegex.test(phone) || phone === "";
};

const validateRomanianCNP = (
  cnp: string
): { isValid: boolean; message: string } => {
  // Check if CNP is empty
  if (!cnp) return { isValid: true, message: "" };

  // Check if CNP has exactly 13 digits
  if (!/^\d{13}$/.test(cnp)) {
    return {
      isValid: false,
      message: "CNP trebuie să conțină exact 13 cifre.",
    };
  }

  // Extract components
  const S = Number.parseInt(cnp.charAt(0));
  const AA = Number.parseInt(cnp.substring(1, 3));
  const LL = Number.parseInt(cnp.substring(3, 5));
  const ZZ = Number.parseInt(cnp.substring(5, 7));
  // const JJ = Number.parseInt(cnp.substring(7, 9));

  // Validate S (sex and century)
  if (S < 1 || S > 8) {
    return {
      isValid: false,
      message: "Prima cifră din CNP trebuie să fie între 1 și 8.",
    };
  }

  // Validate LL (month)
  if (LL < 1 || LL > 12) {
    return {
      isValid: false,
      message: "Luna nașterii trebuie să fie între 01 și 12.",
    };
  }

  // Validate ZZ (day)
  const daysInMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Adjust February for leap years
  let year = AA;
  switch (S) {
    case 1:
    case 2:
      year += 1900;
      break;
    case 3:
    case 4:
      year += 1800;
      break;
    case 5:
    case 6:
      year += 2000;
      break;
  }

  if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
    daysInMonth[2] = 29;
  }

  if (ZZ < 1 || ZZ > daysInMonth[LL]) {
    return {
      isValid: false,
      message: `Ziua nașterii trebuie să fie între 01 și ${daysInMonth[LL]} pentru luna ${LL}.`,
    };
  }

  // Validate JJ (county code)
  const validCountyCodes = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "51",
    "52",
    "70",
  ];

  const JJstr = cnp.substring(7, 9);
  if (!validCountyCodes.includes(JJstr)) {
    return { isValid: false, message: "Codul de județ din CNP nu este valid." };
  }

  // Validate check digit (C)
  const controlNumber = "279146358279";
  let sum = 0;

  for (let i = 0; i < 12; i++) {
    sum +=
      Number.parseInt(cnp.charAt(i)) * Number.parseInt(controlNumber.charAt(i));
  }

  const remainder = sum % 11;
  const checkDigit = remainder === 10 ? 1 : remainder;

  if (checkDigit !== Number.parseInt(cnp.charAt(12))) {
    return {
      isValid: false,
      message: "Cifra de control din CNP nu este validă.",
    };
  }

  return { isValid: true, message: "" };
};

const AddPatientPage: React.FC = () => {
  const [form, setForm] = useState({
    nume: "",
    prenume: "",
    CNP: "",
    adresa: "",
    telefon: "",
    salon: "",
    pat: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear specific field error when user starts typing again
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form fields
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Required fields
    if (!form.nume.trim()) newErrors.nume = "Numele este obligatoriu";
    if (!form.prenume.trim()) newErrors.prenume = "Prenumele este obligatoriu";
    if (!form.CNP.trim()) newErrors.CNP = "CNP-ul este obligatoriu";

    // Phone number validation
    if (form.telefon && !validateRomanianPhoneNumber(form.telefon)) {
      newErrors.telefon =
        "Numărul de telefon trebuie să fie în format românesc (ex: 0728440737)";
    }

    // CNP validation
    if (form.CNP) {
      const cnpValidation = validateRomanianCNP(form.CNP);
      if (!cnpValidation.isValid) {
        newErrors.CNP = cnpValidation.message;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await axios.post("/api/patients", form);
      navigate("/patients"); // back to list
    } catch (err) {
      console.error(err);
      setFormError(
        "Eroare la salvare – verificați câmpurile şi încercați din nou."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-2xl">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-blue-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                />
              </svg>
              <h1 className="text-2xl font-bold text-white">
                Adaugare Pacient
              </h1>
            </div>
            <p className="text-gray-400 mt-1">
              Adauga un nou pacient in sistem.
            </p>
          </CardHeader>

          <form onSubmit={submit}>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: "nume", label: "Nume", required: true },
                    { name: "prenume", label: "Prenume", required: true },
                  ].map((f) => (
                    <div key={f.name} className="space-y-2">
                      <label
                        htmlFor={f.name}
                        className="block text-sm font-medium text-gray-300"
                      >
                        {f.label}{" "}
                        {f.required && <span className="text-red-500">*</span>}
                      </label>
                      <input
                        id={f.name}
                        name={f.name}
                        value={form[f.name as keyof typeof form]}
                        required={f.required}
                        onChange={handleChange}
                        className={`w-full rounded-md border ${
                          errors[f.name] ? "border-red-500" : "border-gray-700"
                        } bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                      />
                      {errors[f.name] && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors[f.name]}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="CNP"
                    className="block text-sm font-medium text-gray-300"
                  >
                    CNP <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="CNP"
                    name="CNP"
                    value={form.CNP}
                    required={true}
                    onChange={handleChange}
                    className={`w-full rounded-md border ${
                      errors.CNP ? "border-red-500" : "border-gray-700"
                    } bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                    placeholder="13 cifre (ex: 1990101123456)"
                  />
                  {errors.CNP && (
                    <p className="text-sm text-red-500 mt-1">{errors.CNP}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="adresa"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Adresă
                  </label>
                  <input
                    id="adresa"
                    name="adresa"
                    value={form.adresa}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      htmlFor="telefon"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Telefon
                    </label>
                    <input
                      id="telefon"
                      name="telefon"
                      value={form.telefon}
                      onChange={handleChange}
                      className={`w-full rounded-md border ${
                        errors.telefon ? "border-red-500" : "border-gray-700"
                      } bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all`}
                      placeholder="10 cifre (ex: 0728440737)"
                    />
                    {errors.telefon && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.telefon}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="salon"
                      className="block text-sm font-medium text-gray-300"
                    >
                      Salon
                    </label>
                    <input
                      id="salon"
                      name="salon"
                      value={form.salon}
                      onChange={handleChange}
                      className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="pat"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Pat
                  </label>
                  <input
                    id="pat"
                    name="pat"
                    value={form.pat}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-700 bg-gray-800 p-2 text-white shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all"
                  />
                </div>

                {formError && (
                  <Alert>
                    <div className="flex">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      <span>{formError}</span>
                    </div>
                  </Alert>
                )}
              </div>
            </CardContent>

            <CardFooter>
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[100px]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Se salveaza...
                  </div>
                ) : (
                  "Salveaza"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
};

export default AddPatientPage;
