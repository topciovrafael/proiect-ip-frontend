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
} from "lucide-react";

export default function Dashboard() {
  const [activeRole, setActiveRole] = useState("doctor");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  //   const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Check if mobile
  //   const isMobile = () => {
  //     if (typeof window !== "undefined") {
  //       return window.innerWidth < 768;
  //     }
  //     return false;
  //   };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
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
                  href="#"
                  className="flex items-center gap-2 rounded-md bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </a>
              </li>
              <li>
                <a
                  href="/patients"
                  className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
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
          {/* Mobile menu button */}
          <button
            className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
            onClick={toggleSidebar}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex flex-1 items-center gap-4">
            {/* Search (half) */}
            <form className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-md border border-gray-300 bg-gray-100 py-2 pl-8 pr-4 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:focus:border-blue-400 dark:focus:ring-blue-400"
              />
            </form>

            {/* Role Tabs (half) */}
            <div className="hidden md:flex flex-1">
              <div className="flex w-full rounded-md border border-gray-200 bg-gray-50 p-1 dark:border-gray-700 dark:bg-gray-800">
                {["doctor", "receptionist", "pharmacist", "admin"].map(
                  (role) => (
                    <button
                      key={role}
                      className={`flex-1 text-center rounded-md px-3 py-1 text-sm font-medium ${
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
            <div className="relative flex-none" ref={notificationsRef}>
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
                  {/* ...notification list... */}
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
              <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
              <div className="flex items-center gap-2">
                <button className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-offset-gray-900">
                  <Plus className="mr-2 h-4 w-4" />
                  New Patient
                </button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Active Patients Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Patients
                </h3>
                <div className="mt-2 text-2xl font-bold">128</div>
                <p className="text-xs text-green-500">+4% from last week</p>
              </div>

              {/* Pending Deliveries Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Pending Deliveries
                </h3>
                <div className="mt-2 text-2xl font-bold">24</div>
                <p className="text-xs text-amber-500">3 urgent</p>
              </div>

              {/* Active Robots Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Active Robots
                </h3>
                <div className="mt-2 text-2xl font-bold">5/6</div>
                <p className="text-xs text-red-500">1 in maintenance</p>
              </div>

              {/* Bed Occupancy Card */}
              <div className="rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  Bed Occupancy
                </h3>
                <div className="mt-2 text-2xl font-bold">78%</div>
                <p className="text-xs text-blue-500">12 beds available</p>
              </div>
            </div>

            {/* Robot Status and Map */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Robot Status Card */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                  <h2 className="text-lg font-semibold">Robot Status</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Current status of all delivery robots
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        name: "Robot #1",
                        status: "Active",
                        location: "Ward A",
                        battery: 87,
                        task: "Delivering to Room 302",
                      },
                      {
                        id: 2,
                        name: "Robot #2",
                        status: "Active",
                        location: "Pharmacy",
                        battery: 92,
                        task: "Loading medications",
                      },
                      {
                        id: 3,
                        name: "Robot #3",
                        status: "Alert",
                        location: "Ward B",
                        battery: 45,
                        task: "Stuck - Assistance needed",
                      },
                      {
                        id: 4,
                        name: "Robot #4",
                        status: "Active",
                        location: "Corridor C",
                        battery: 76,
                        task: "Returning to base",
                      },
                      {
                        id: 5,
                        name: "Robot #5",
                        status: "Active",
                        location: "Ward D",
                        battery: 64,
                        task: "Waiting for pickup",
                      },
                      {
                        id: 6,
                        name: "Robot #6",
                        status: "Inactive",
                        location: "Maintenance Bay",
                        battery: 23,
                        task: "Under maintenance",
                      },
                    ].map((robot) => (
                      <div
                        key={robot.id}
                        className="rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-3 w-3 rounded-full ${
                                robot.status === "Active"
                                  ? "bg-green-500"
                                  : robot.status === "Alert"
                                  ? "bg-red-500"
                                  : "bg-gray-500"
                              }`}
                            />
                            <span className="font-medium">{robot.name}</span>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              robot.status === "Active"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : robot.status === "Alert"
                                ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            }`}
                          >
                            {robot.status}
                          </span>
                        </div>
                        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                          <p>Location: {robot.location}</p>
                          <p>Task: {robot.task}</p>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between text-xs">
                            <span>Battery</span>
                            <span>{robot.battery}%</span>
                          </div>
                          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                            <div
                              className={`h-full rounded-full ${
                                robot.battery > 70
                                  ? "bg-green-500"
                                  : robot.battery > 30
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                              style={{ width: `${robot.battery}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Hospital Map Card */}
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                  <h2 className="text-lg font-semibold">Hospital Map</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Live view of hospital layout and robot locations
                  </p>
                </div>
                <div className="p-0">
                  <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                    {/* This would be replaced with an actual map component */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Interactive Hospital Map
                      </p>
                    </div>

                    {/* Robot indicators on the map */}
                    <div className="absolute left-[20%] top-[30%] h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2" />
                    <div className="absolute left-[45%] top-[15%] h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2" />
                    <div className="absolute left-[60%] top-[40%] h-3 w-3 rounded-full bg-red-500 ring-2 ring-red-300 ring-offset-2 animate-pulse" />
                    <div className="absolute left-[30%] top-[60%] h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2" />
                    <div className="absolute left-[75%] top-[70%] h-3 w-3 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2" />
                  </div>
                </div>
                <div className="border-t border-gray-200 p-4 dark:border-gray-800">
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
                      <span>Alert</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-gray-500" />
                      <span>Inactive</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity and Pending Tasks */}
            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              {/* Recent Activity Card */}
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                  <h2 className="text-lg font-semibold">Recent Activity</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Latest system events and activities
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        time: "09:42 AM",
                        event:
                          "Robot #2 completed medication delivery to Room 304",
                        type: "delivery",
                      },
                      {
                        time: "09:30 AM",
                        event:
                          "New patient Maria Garcia registered by Dr. Johnson",
                        type: "patient",
                      },
                      {
                        time: "09:15 AM",
                        event:
                          "Prescription updated for patient #1042 by Dr. Chen",
                        type: "prescription",
                      },
                      {
                        time: "08:55 AM",
                        event: "Robot #3 reported obstacle in Corridor B",
                        type: "alert",
                      },
                      {
                        time: "08:30 AM",
                        event:
                          "Medication inventory updated by Pharmacist Wilson",
                        type: "inventory",
                      },
                    ].map((activity, index) => (
                      <div key={index} className="flex gap-4">
                        <div
                          className={`mt-0.5 rounded-full p-1.5 ${
                            activity.type === "delivery"
                              ? "bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-400"
                              : activity.type === "patient"
                              ? "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-400"
                              : activity.type === "prescription"
                              ? "bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-400"
                              : activity.type === "alert"
                              ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-400"
                              : "bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-400"
                          }`}
                        >
                          {activity.type === "delivery" ? (
                            <Layers className="h-4 w-4" />
                          ) : activity.type === "patient" ? (
                            <User className="h-4 w-4" />
                          ) : activity.type === "prescription" ? (
                            <ClipboardList className="h-4 w-4" />
                          ) : activity.type === "alert" ? (
                            <Bell className="h-4 w-4" />
                          ) : (
                            <Pill className="h-4 w-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm">{activity.event}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {activity.time}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                  <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                    View All Activity
                  </button>
                </div>
              </div>

              {/* Pending Tasks Card */}
              <div className="rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
                <div className="border-b border-gray-200 px-6 py-4 dark:border-gray-800">
                  <h2 className="text-lg font-semibold">Pending Tasks</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Tasks requiring your attention
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {[
                      {
                        id: 1,
                        task: "Review prescription for Patient #1056",
                        priority: "High",
                        due: "Today, 11:00 AM",
                      },
                      {
                        id: 2,
                        task: "Approve medication delivery to Ward C",
                        priority: "Medium",
                        due: "Today, 1:30 PM",
                      },
                      {
                        id: 3,
                        task: "Assign new patient to available bed",
                        priority: "Medium",
                        due: "Today, 2:00 PM",
                      },
                      {
                        id: 4,
                        task: "Check Robot #3 status after maintenance",
                        priority: "Low",
                        due: "Tomorrow, 9:00 AM",
                      },
                      {
                        id: 5,
                        task: "Update medication inventory",
                        priority: "Medium",
                        due: "Tomorrow, 11:00 AM",
                      },
                    ].map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-3 rounded-lg border border-gray-200 p-4 dark:border-gray-800"
                      >
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{task.task}</p>
                          <div className="mt-1 flex items-center gap-2 text-xs">
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium ${
                                task.priority === "High"
                                  ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                                  : task.priority === "Medium"
                                  ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                              }`}
                            >
                              {task.priority}
                            </span>
                            <span className="text-gray-500 dark:text-gray-400">
                              Due: {task.due}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4 dark:border-gray-800">
                  <button className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700">
                    View All Tasks
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
