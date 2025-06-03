"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  X,
  Check,
  Loader2,
  AlertTriangle,
  Eye,
  EyeOff,
} from "lucide-react";

interface User {
  id: number;
  nume: string;
  prenume: string;
  rol: string;
  username: string;
  email: string;
  parola: string;
  status: string;
}

const UserAdministration = () => {
  // State for users list and operations
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // State for user operations
  const [addUser, setAddUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<User>>({
    nume: "",
    prenume: "",
    rol: "Receptionist",
    username: "",
    email: "",
    parola: "",
    status: "Activ",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/utilizatori");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    `${user.nume} ${user.prenume} ${user.email} ${user.username} ${user.rol}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Validate form data
  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.nume?.trim()) errors.nume = "Numele este obligatoriu";
    if (!formData.prenume?.trim())
      errors.prenume = "Prenumele este obligatoriu";
    if (!formData.username?.trim())
      errors.username = "Username-ul este obligatoriu";
    if (!formData.email?.trim()) errors.email = "Email-ul este obligatoriu";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      errors.email = "Email-ul nu este valid";

    if (!editUser && !formData.parola?.trim())
      errors.parola = "Parola este obligatorie";
    else if (!editUser && formData.parola && formData.parola.length < 6)
      errors.parola = "Parola trebuie să aibă minim 6 caractere";

    return errors;
  };

  // Handle create user
  const handleCreateUser = async () => {
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const response = await fetch("/api/utilizatori", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to create user");
      }

      await fetchUsers();
      setAddUser(false);
      setFormData({
        nume: "",
        prenume: "",
        rol: "Receptionist",
        username: "",
        email: "",
        parola: "",
        status: "Activ",
      });
    } catch (err) {
      setFormErrors({
        submit: err instanceof Error ? err.message : "Failed to create user",
      });
      console.error("Error creating user:", err);
    } finally {
      setSaving(false);
    }
  };

  // Handle update user
  const handleUpdateUser = async () => {
    if (!editUser) return;

    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSaving(true);
    try {
      const response = await fetch(`/api/utilizatori/${editUser.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to update user");
      }

      await fetchUsers();
      setEditUser(null);
      setFormData({
        nume: "",
        prenume: "",
        rol: "Receptionist",
        username: "",
        email: "",
        parola: "",
        status: "Activ",
      });
    } catch (err) {
      setFormErrors({
        submit: err instanceof Error ? err.message : "Failed to update user",
      });
      console.error("Error updating user:", err);
    } finally {
      setSaving(false);
    }
  };

  // Handle delete user
  const handleDeleteUser = async (id: number) => {
    try {
      const response = await fetch(`/api/utilizatori/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to delete user");
      }

      await fetchUsers();
      setDeleteConfirm(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user");
      console.error("Error deleting user:", err);
    }
  };

  // Start editing a user
  const startEditUser = (user: User) => {
    setEditUser(user);
    setFormData({
      nume: user.nume,
      prenume: user.prenume,
      rol: user.rol,
      username: user.username,
      email: user.email,
      parola: "", // Don't populate password for security
      status: user.status,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 text-gray-900">
      <h1 className="mb-6 text-2xl font-bold">Administrare Utilizatori</h1>

      {/* Search and Add User button */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input
            className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Caută utilizator..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setAddUser(true)}
          className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700"
        >
          <Plus className="h-4 w-4" /> Utilizator nou
        </button>
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

      {/* Users list */}
      {loading ? (
        <div className="flex items-center gap-2 text-gray-600">
          <Loader2 className="h-5 w-5 animate-spin" /> Se încarcă...
        </div>
      ) : (
        <div className="rounded border border-gray-300 bg-white">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="font-semibold">Lista Utilizatori</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-100 text-xs uppercase text-gray-600">
                  <th className="px-6 py-3 text-left">ID</th>
                  <th className="px-6 py-3 text-left">Nume</th>
                  <th className="px-6 py-3 text-left">Username</th>
                  <th className="px-6 py-3 text-left">Email</th>
                  <th className="px-6 py-3 text-left">Rol</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Acțiuni</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 font-medium">{user.id}</td>
                    <td className="px-6 py-3">
                      {user.nume} {user.prenume}
                    </td>
                    <td className="px-6 py-3">{user.username}</td>
                    <td className="px-6 py-3">{user.email}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          user.rol === "Administrator"
                            ? "bg-purple-100 text-purple-800"
                            : user.rol === "Medic"
                            ? "bg-blue-100 text-blue-800"
                            : user.rol === "Farmacist"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.rol}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-block rounded-full px-2 py-1 text-xs ${
                          user.status === "activ"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center space-x-2">
                        <button
                          title="Edit"
                          onClick={() => startEditUser(user)}
                          className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          title="Delete"
                          onClick={() => setDeleteConfirm(user.id)}
                          className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!filteredUsers.length && (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Nu au fost găsiți utilizatori.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Adaugă Utilizator Nou</h2>
              <button
                onClick={() => setAddUser(false)}
                className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Nume <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nume"
                    value={formData.nume || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.nume ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.nume && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.nume}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Prenume <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenume"
                    value={formData.prenume || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.prenume ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.prenume && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.prenume}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  name="rol"
                  value={formData.rol || "Receptionist"}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 bg-white p-2"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Farmacist">Farmacist</option>
                  <option value="Medic">Medic</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.username ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Parolă <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="parola"
                      value={formData.parola || ""}
                      onChange={handleInputChange}
                      className={`w-full rounded border ${
                        formErrors.parola ? "border-red-500" : "border-gray-300"
                      } bg-white p-2 pr-10`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.parola && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.parola}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status || "activ"}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 bg-white p-2"
                  >
                    <option value="activ">Activ</option>
                    <option value="inactiv">Inactiv</option>
                  </select>
                </div>
              </div>

              {formErrors.submit && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-800">{formErrors.submit}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setAddUser(false)}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                disabled={saving}
                onClick={handleCreateUser}
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

      {/* Edit User Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Editează Utilizator</h2>
              <button
                onClick={() => setEditUser(null)}
                className="rounded p-1 text-gray-600 hover:bg-gray-200 hover:text-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Nume <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nume"
                    value={formData.nume || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.nume ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.nume && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.nume}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Prenume <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="prenume"
                    value={formData.prenume || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.prenume ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.prenume && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.prenume}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-700">
                  Rol <span className="text-red-500">*</span>
                </label>
                <select
                  name="rol"
                  value={formData.rol || "Receptionist"}
                  onChange={handleInputChange}
                  className="w-full rounded border border-gray-300 bg-white p-2"
                >
                  <option value="Receptionist">Receptionist</option>
                  <option value="Farmacist">Farmacist</option>
                  <option value="Medic">Medic</option>
                  <option value="Administrator">Administrator</option>
                </select>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Username <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={formData.username || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.username ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.username && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ""}
                    onChange={handleInputChange}
                    className={`w-full rounded border ${
                      formErrors.email ? "border-red-500" : "border-gray-300"
                    } bg-white p-2`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.email}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm text-gray-700">
                    Parolă nouă{" "}
                    <span className="text-gray-500">(opțional)</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="parola"
                      value={formData.parola || ""}
                      onChange={handleInputChange}
                      className={`w-full rounded border ${
                        formErrors.parola ? "border-red-500" : "border-gray-300"
                      } bg-white p-2 pr-10`}
                      placeholder="Lăsați gol pentru a păstra parola actuală"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-700"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {formErrors.parola && (
                    <p className="mt-1 text-xs text-red-500">
                      {formErrors.parola}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-700">Status</label>
                  <select
                    name="status"
                    value={formData.status || "activ"}
                    onChange={handleInputChange}
                    className="w-full rounded border border-gray-300 bg-white p-2"
                  >
                    <option value="activ">Activ</option>
                    <option value="inactiv">Inactiv</option>
                  </select>
                </div>
              </div>

              {formErrors.submit && (
                <div className="rounded-md bg-red-50 border border-red-200 p-3">
                  <p className="text-sm text-red-800">{formErrors.submit}</p>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditUser(null)}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                disabled={saving}
                onClick={handleUpdateUser}
                className="inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-black hover:bg-blue-700 disabled:opacity-70"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Se salvează...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" /> Salvează modificările
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-medium">Confirmare ștergere</h3>
              <p className="mt-2 text-sm text-gray-600">
                Sunteți sigur că doriți să ștergeți acest utilizator? Această
                acțiune nu poate fi anulată.
              </p>
            </div>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="rounded border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
              >
                Anulează
              </button>
              <button
                onClick={() => handleDeleteUser(deleteConfirm)}
                className="rounded bg-red-600 px-4 py-2 text-sm font-medium text-black hover:bg-red-700"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserAdministration;
