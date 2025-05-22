"use client";

import { useState, useRef, useEffect } from "react";
import {
  Activity,
  Bell,
  Calendar,
  ChevronDown,
  ClipboardList,
  Home,
  Layers,
  LogOut,
  Map,
  MessageSquare,
  Pill,
  Plus,
  Search,
  Settings,
  User,
  Users,
  Menu,
  X,
  Filter,
  Edit,
  Trash2,
  FileText,
  Heart,
  AlertCircle,
} from "lucide-react";

// Sample patient data
const patientsData = [
  {
    id: "P-1042",
    name: "Emma Thompson",
    age: 42,
    gender: "Female",
    room: "304",
    admissionDate: "2023-11-15",
    diagnosis: "Hypertension",
    status: "Stable",
    doctor: "Dr. Sarah Chen",
    bloodType: "A+",
    allergies: ["Penicillin", "Peanuts"],
    nextAppointment: "2023-12-05",
    medicationCount: 3,
    priority: "Medium",
  },
  {
    id: "P-1043",
    name: "James Wilson",
    age: 65,
    gender: "Male",
    room: "210",
    admissionDate: "2023-11-10",
    diagnosis: "Pneumonia",
    status: "Critical",
    doctor: "Dr. Michael Rodriguez",
    bloodType: "O-",
    allergies: ["Sulfa"],
    nextAppointment: "2023-11-25",
    medicationCount: 5,
    priority: "High",
  },
  {
    id: "P-1044",
    name: "Sophia Garcia",
    age: 28,
    gender: "Female",
    room: "115",
    admissionDate: "2023-11-18",
    diagnosis: "Appendicitis",
    status: "Recovering",
    doctor: "Dr. Sarah Chen",
    bloodType: "B+",
    allergies: [],
    nextAppointment: "2023-11-28",
    medicationCount: 2,
    priority: "Medium",
  },
  {
    id: "P-1045",
    name: "Robert Johnson",
    age: 72,
    gender: "Male",
    room: "402",
    admissionDate: "2023-11-05",
    diagnosis: "Congestive Heart Failure",
    status: "Stable",
    doctor: "Dr. William Lee",
    bloodType: "AB+",
    allergies: ["Aspirin", "Shellfish"],
    nextAppointment: "2023-12-01",
    medicationCount: 7,
    priority: "High",
  },
  {
    id: "P-1046",
    name: "Olivia Martinez",
    age: 35,
    gender: "Female",
    room: "218",
    admissionDate: "2023-11-20",
    diagnosis: "Migraine",
    status: "Stable",
    doctor: "Dr. Michael Rodriguez",
    bloodType: "O+",
    allergies: ["Latex"],
    nextAppointment: "2023-11-27",
    medicationCount: 2,
    priority: "Low",
  },
  {
    id: "P-1047",
    name: "William Davis",
    age: 58,
    gender: "Male",
    room: "301",
    admissionDate: "2023-11-12",
    diagnosis: "Diabetes Type 2",
    status: "Stable",
    doctor: "Dr. Sarah Chen",
    bloodType: "A-",
    allergies: [],
    nextAppointment: "2023-12-10",
    medicationCount: 4,
    priority: "Medium",
  },
  {
    id: "P-1048",
    name: "Ava Brown",
    age: 8,
    gender: "Female",
    room: "Pediatrics 105",
    admissionDate: "2023-11-19",
    diagnosis: "Asthma",
    status: "Improving",
    doctor: "Dr. Emily Johnson",
    bloodType: "B-",
    allergies: ["Dust", "Pollen"],
    nextAppointment: "2023-11-26",
    medicationCount: 2,
    priority: "Medium",
  },
  {
    id: "P-1049",
    name: "Daniel Miller",
    age: 45,
    gender: "Male",
    room: "220",
    admissionDate: "2023-11-17",
    diagnosis: "Kidney Stones",
    status: "Recovering",
    doctor: "Dr. William Lee",
    bloodType: "O+",
    allergies: ["Iodine"],
    nextAppointment: "2023-11-30",
    medicationCount: 3,
    priority: "Medium",
  },
];

export default function PatientsPage() {
  const [activeRole, setActiveRole] = useState("doctor");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setUserMenuOpen(false);
      }
      if (
        filterMenuRef.current &&
        !filterMenuRef.current.contains(event.target as Node)
      ) {
        setFilterMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Filter patients based on search query and status filter
  const filteredPatients = patientsData.filter((patient) => {
    const matchesSearch =
      patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      patient.diagnosis.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter ? patient.status === statusFilter : true;

    return matchesSearch && matchesStatus;
  });

  // Get patient details by ID
  const getPatientById = (id: string) => {
    return patientsData.find((patient) => patient.id === id);
  };

  // Get status color class
  const getStatusColorClass = (status: string) => {
    switch (status) {
      case "Critical":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Stable":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Recovering":
      case "Improving":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  // Get priority color class
  const getPriorityColorClass = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Medium":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "Low":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-gray-200 bg-white transition-transform duration-300 ease-in-out dark:border-gray-800 dark:bg-gray-950 md:relative md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">MedRobot</span>
          </div>
          <button
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex flex-col overflow-y-auto p-4">
          {/* Main Navigation */}
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Main
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="/"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/patients"
                  className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  <Users className="h-5 w-5" />
                  <span>Patients</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Pill className="h-5 w-5" />
                  <span>Medications</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Layers className="h-5 w-5" />
                  <span>Robots</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Map className="h-5 w-5" />
                  <span>Hospital Map</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Management Navigation */}
          <div className="mb-6">
            <h3 className="mb-2 text-xs font-semibold uppercase text-gray-500 dark:text-gray-400">
              Management
            </h3>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <ClipboardList className="h-5 w-5" />
                  <span>Prescriptions</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <Calendar className="h-5 w-5" />
                  <span>Schedule</span>
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Messages</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto border-t border-gray-200 p-4 dark:border-gray-800">
          <div className="relative" ref={userMenuRef}>
            <button
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="relative h-8 w-8 overflow-hidden rounded-full bg-gray-200">
                <img
                  src="/placeholder-user.jpg"
                  alt="User"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23666' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'%3E%3C/path%3E%3Ccircle cx='12' cy='7' r='4'%3E%3C/circle%3E%3C/svg%3E`;
                  }}
                />
              </div>
              <div className="flex flex-col items-start">
                <span>Dr. Sarah Chen</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Cardiology
                </span>
              </div>
              <ChevronDown className="ml-auto h-4 w-4" />
            </button>

            {userMenuOpen && (
              <div className="absolute bottom-full left-0 mb-2 w-full rounded-md border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-800">
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  <span>Profile</span>
                </a>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </a>
                <div className="my-1 h-px bg-gray-200 dark:bg-gray-700"></div>
                <a
                  href="#"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 flex-col w-full">
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 dark:border-gray-800 dark:bg-gray-950 sm:px-6">
          <button
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center gap-4">
            <form className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search patients by name, ID, or diagnosis..."
                className="w-full rounded-md border border-gray-300 bg-gray-100 py-2 pl-8 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>

            {/* Role Tabs */}
            <div className="hidden md:block">
              <div className="flex rounded-md border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                {["doctor", "receptionist", "pharmacist", "admin"].map(
                  (role) => (
                    <button
                      key={role}
                      className={`rounded-md px-3 py-1 text-sm font-medium ${
                        activeRole === role
                          ? "bg-white text-blue-600 shadow-sm dark:bg-gray-700 dark:text-blue-400"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100"
                      }`}
                      onClick={() => setActiveRole(role)}
                    >
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Notifications */}
            <div className="relative" ref={notificationsRef}>
              <button
                className="relative rounded-md border border-gray-300 p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                  3
                </span>
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                  <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                    <h3 className="font-medium">Notifications</h3>
                  </div>
                  <div className="max-h-80 overflow-auto">
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
                        <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">Patient Alert</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          James Wilson (P-1043) vital signs need attention.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          5 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                        <Pill className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">Medication Due</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Emma Thompson (P-1042) medication is due in 30
                          minutes.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          15 minutes ago
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4 p-3 hover:bg-gray-100 dark:hover:bg-gray-700">
                      <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                        <User className="h-4 w-4 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="grid gap-1">
                        <p className="text-sm font-medium">
                          New Patient Assigned
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          New patient Ava Brown has been assigned to you.
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          1 hour ago
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 p-2 dark:border-gray-700">
                    <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                      View all notifications
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Mobile Role Selector */}
        <div className="border-b border-gray-200 bg-white p-2 dark:border-gray-800 dark:bg-gray-950 md:hidden">
          <select
            className="w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 dark:border-gray-700"
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value)}
          >
            <option value="doctor">Doctor</option>
            <option value="receptionist">Receptionist</option>
            <option value="pharmacist">Pharmacist</option>
            <option value="admin">Administrator</option>
          </select>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="w-full">
            {/* Page Header */}
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Patients</h1>
              <div className="flex flex-wrap items-center gap-2">
                <div className="relative" ref={filterMenuRef}>
                  <button
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
                    onClick={() => setFilterMenuOpen(!filterMenuOpen)}
                  >
                    <Filter className="mr-2 h-4 w-4" />
                    Filter
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </button>

                  {filterMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
                      <div className="border-b border-gray-200 px-4 py-3 dark:border-gray-700">
                        <h3 className="font-medium">Filter by Status</h3>
                      </div>
                      <div className="p-2">
                        <button
                          className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm ${
                            statusFilter === null
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setStatusFilter(null)}
                        >
                          All Patients
                        </button>
                        <button
                          className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm ${
                            statusFilter === "Critical"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setStatusFilter("Critical")}
                        >
                          Critical
                        </button>
                        <button
                          className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm ${
                            statusFilter === "Stable"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setStatusFilter("Stable")}
                        >
                          Stable
                        </button>
                        <button
                          className={`mb-1 w-full rounded-md px-3 py-2 text-left text-sm ${
                            statusFilter === "Recovering"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setStatusFilter("Recovering")}
                        >
                          Recovering
                        </button>
                        <button
                          className={`w-full rounded-md px-3 py-2 text-left text-sm ${
                            statusFilter === "Improving"
                              ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                              : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                          }`}
                          onClick={() => setStatusFilter("Improving")}
                        >
                          Improving
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
                  onClick={() => setShowAddPatientModal(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Patient
                </button>
              </div>
            </div>

            {/* Patient Stats */}
            <div className="mb-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Total Patients
                </h3>
                <div className="mt-2 text-2xl font-bold">128</div>
                <p className="text-xs text-green-500">+12 this month</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Critical Patients
                </h3>
                <div className="mt-2 text-2xl font-bold">5</div>
                <p className="text-xs text-red-500">
                  Requires immediate attention
                </p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Scheduled Today
                </h3>
                <div className="mt-2 text-2xl font-bold">18</div>
                <p className="text-xs text-blue-500">3 appointments pending</p>
              </div>
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Discharge Pending
                </h3>
                <div className="mt-2 text-2xl font-bold">7</div>
                <p className="text-xs text-amber-500">
                  Awaiting final approval
                </p>
              </div>
            </div>

            {/* Patients Table */}
            <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
              <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                <h2 className="text-lg font-semibold">Patient List</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredPatients.length}{" "}
                  {filteredPatients.length === 1 ? "patient" : "patients"} found
                  {statusFilter ? ` with status "${statusFilter}"` : ""}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                      <th className="whitespace-nowrap px-6 py-3">
                        Patient ID
                      </th>
                      <th className="whitespace-nowrap px-6 py-3">Name</th>
                      <th className="whitespace-nowrap px-6 py-3">
                        Age/Gender
                      </th>
                      <th className="whitespace-nowrap px-6 py-3">Room</th>
                      <th className="whitespace-nowrap px-6 py-3">Diagnosis</th>
                      <th className="whitespace-nowrap px-6 py-3">Status</th>
                      <th className="whitespace-nowrap px-6 py-3">Doctor</th>
                      <th className="whitespace-nowrap px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPatients.length > 0 ? (
                      filteredPatients.map((patient) => (
                        <tr
                          key={patient.id}
                          className="bg-white hover:bg-gray-50 dark:bg-gray-950 dark:hover:bg-gray-900"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900 dark:text-white">
                            {patient.id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {patient.name}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {patient.age} / {patient.gender}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {patient.room}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {patient.diagnosis}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColorClass(
                                patient.status
                              )}`}
                            >
                              {patient.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {patient.doctor}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-2">
                              <button
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                onClick={() => setSelectedPatient(patient.id)}
                                title="View Details"
                              >
                                <FileText className="h-4 w-4" />
                              </button>
                              <button
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                                title="Edit Patient"
                              >
                                <Edit className="h-4 w-4" />
                              </button>
                              <button
                                className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-red-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-red-500"
                                title="Delete Patient"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={8}
                          className="px-6 py-4 text-center text-sm text-gray-500 dark:text-gray-400"
                        >
                          No patients found matching your criteria.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Showing{" "}
                    <span className="font-medium">
                      {filteredPatients.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium">{patientsData.length}</span>{" "}
                    patients
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                      Previous
                    </button>
                    <button className="rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Patient Detail Modal */}
            {selectedPatient && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="w-full max-w-3xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Patient Details</h2>
                    <button
                      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      onClick={() => setSelectedPatient(null)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  {(() => {
                    const patient = getPatientById(selectedPatient);
                    if (!patient) return <p>Patient not found</p>;

                    return (
                      <div className="space-y-6">
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="flex-1 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 text-lg font-semibold">
                              Personal Information
                            </h3>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Patient ID:
                                </span>
                                <span className="text-sm">{patient.id}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Name:
                                </span>
                                <span className="text-sm">{patient.name}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Age:
                                </span>
                                <span className="text-sm">{patient.age}</span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Gender:
                                </span>
                                <span className="text-sm">
                                  {patient.gender}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Blood Type:
                                </span>
                                <span className="text-sm">
                                  {patient.bloodType}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Room:
                                </span>
                                <span className="text-sm">{patient.room}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex-1 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="mb-2 text-lg font-semibold">
                              Medical Information
                            </h3>
                            <div className="grid gap-2">
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Diagnosis:
                                </span>
                                <span className="text-sm">
                                  {patient.diagnosis}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Status:
                                </span>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColorClass(
                                    patient.status
                                  )}`}
                                >
                                  {patient.status}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Doctor:
                                </span>
                                <span className="text-sm">
                                  {patient.doctor}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Admission Date:
                                </span>
                                <span className="text-sm">
                                  {patient.admissionDate}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Next Appointment:
                                </span>
                                <span className="text-sm">
                                  {patient.nextAppointment}
                                </span>
                              </div>
                              <div className="grid grid-cols-2">
                                <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                  Priority:
                                </span>
                                <span
                                  className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getPriorityColorClass(
                                    patient.priority
                                  )}`}
                                >
                                  {patient.priority}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                          <h3 className="mb-2 text-lg font-semibold">
                            Allergies
                          </h3>
                          {patient.allergies.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {patient.allergies.map((allergy, index) => (
                                <span
                                  key={index}
                                  className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300"
                                >
                                  {allergy}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              No known allergies
                            </p>
                          )}
                        </div>

                        <div className="flex flex-col gap-4 sm:flex-row">
                          <div className="flex-1 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <div className="flex items-center justify-between">
                              <h3 className="text-lg font-semibold">
                                Medications
                              </h3>
                              <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                {patient.medicationCount} Active
                              </span>
                            </div>
                            <button className="mt-2 w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                              View Medications
                            </button>
                          </div>

                          <div className="flex-1 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                            <h3 className="text-lg font-semibold">
                              Vital Signs
                            </h3>
                            <div className="mt-2 flex items-center gap-4">
                              <div className="flex flex-col items-center">
                                <Heart className="h-5 w-5 text-red-500" />
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Heart Rate
                                </span>
                                <span className="font-medium">78 bpm</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-blue-500">
                                  BP
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Blood Pressure
                                </span>
                                <span className="font-medium">120/80</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-amber-500">
                                  O₂
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Oxygen
                                </span>
                                <span className="font-medium">98%</span>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-sm font-bold text-purple-500">
                                  T
                                </span>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  Temperature
                                </span>
                                <span className="font-medium">98.6°F</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-end space-x-2">
                          <button className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                            Print Record
                          </button>
                          <button className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900">
                            Edit Patient
                          </button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            )}

            {/* Add Patient Modal */}
            {showAddPatientModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
                <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-lg dark:bg-gray-900">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Add New Patient</h2>
                    <button
                      className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                      onClick={() => setShowAddPatientModal(false)}
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="name"
                          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          placeholder="Enter patient name"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label
                            htmlFor="age"
                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Age
                          </label>
                          <input
                            type="number"
                            id="age"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                            placeholder="Age"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="gender"
                            className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                          >
                            Gender
                          </label>
                          <select
                            id="gender"
                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          >
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="room"
                          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Room Number
                        </label>
                        <input
                          type="text"
                          id="room"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                          placeholder="Room number"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="bloodType"
                          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Blood Type
                        </label>
                        <select
                          id="bloodType"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <option value="">Select</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="diagnosis"
                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Diagnosis
                      </label>
                      <input
                        type="text"
                        id="diagnosis"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        placeholder="Primary diagnosis"
                      />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label
                          htmlFor="status"
                          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Status
                        </label>
                        <select
                          id="status"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <option value="">Select</option>
                          <option value="Stable">Stable</option>
                          <option value="Critical">Critical</option>
                          <option value="Recovering">Recovering</option>
                          <option value="Improving">Improving</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="doctor"
                          className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                          Assigned Doctor
                        </label>
                        <select
                          id="doctor"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        >
                          <option value="">Select</option>
                          <option value="Dr. Sarah Chen">Dr. Sarah Chen</option>
                          <option value="Dr. Michael Rodriguez">
                            Dr. Michael Rodriguez
                          </option>
                          <option value="Dr. William Lee">
                            Dr. William Lee
                          </option>
                          <option value="Dr. Emily Johnson">
                            Dr. Emily Johnson
                          </option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label
                        htmlFor="allergies"
                        className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Allergies
                      </label>
                      <input
                        type="text"
                        id="allergies"
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200"
                        placeholder="Comma separated list of allergies"
                      />
                    </div>

                    <div className="flex justify-end space-x-2">
                      <button
                        type="button"
                        className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700"
                        onClick={() => setShowAddPatientModal(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900"
                      >
                        Add Patient
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
