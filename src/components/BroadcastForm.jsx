import React from "react";
import { useState, useEffect } from "react";
import Select from "react-select";
import api from "../api/app";
import toast from "react-hot-toast";

const roles = [
  { label: "Admin", value: "admin" },
  { label: "HR", value: "hr" },
  { label: "Employee", value: "employee" },
];

export default function BroadcastForm() {
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [allRolesSelected, setAllRolesSelected] = useState(false);
  const [allUsersSelected, setAllUsersSelected] = useState(false);

  // Fetch users whenever roles change
  useEffect(() => {
    if (selectedRoles.length === 0) {
      setUsers([]);
      setSelectedUsers([]);
      return;
    }

    const fetchUsers = async () => {
      try {
        const rolesQuery = selectedRoles.map((r) => r.value).join(",");
        const res = await api.get(`/users?roles=${rolesQuery}`);
        setUsers(res.data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to fetch users");
      }
    };

    fetchUsers();
  }, [selectedRoles]);

  // Handle "Select All" for roles
  const handleSelectAllRoles = () => {
    if (allRolesSelected) {
      setSelectedRoles([]);
    } else {
      setSelectedRoles(roles);
    }
    setAllRolesSelected(!allRolesSelected);
  };

  // Handle "Select All" for users
  const handleSelectAllUsers = () => {
    if (allUsersSelected) {
      setSelectedUsers([]);
    } else {
      const allUserOptions = users.map((u) => ({
        label: `${u.name} (${u.phone})`,
        value: u.phone,
      }));
      setSelectedUsers(allUserOptions);
    }
    setAllUsersSelected(!allUsersSelected);
  };

  // Handle sending broadcast
  const handleSend = async () => {
    if (!message.trim()) return toast.error("Message cannot be empty");
    if (selectedUsers.length === 0) return toast.error("Select at least one user");

    try {
      const recipients = selectedUsers.map((u) => u.value).join(",");
      await api.post("/broadcast", { message, recipients });

      toast.success("Broadcast sent successfully!");
      setMessage("");
      setSelectedUsers([]);
      setSelectedRoles([]);
      setUsers([]);
      setAllRolesSelected(false);
      setAllUsersSelected(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send broadcast");
    }
  };

  // Light theme styles for react-select
  const lightSelectStyles = {
    control: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderColor: "#d1d5db",
      boxShadow: "none",
      "&:hover": { borderColor: "#60a5fa" },
      minHeight: "44px",
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#fff",
      borderRadius: "8px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      zIndex: 100,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "#eff6ff" : "#fff",
      color: "#111827",
      cursor: "pointer",
    }),
    multiValue: (base) => ({
      ...base,
      backgroundColor: "#e0f2fe",
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: "#0369a1",
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: "#0369a1",
      ":hover": { backgroundColor: "#0369a1", color: "#fff" },
    }),
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 px-4 py-10">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-lg p-8 border border-gray-100">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-8">
          📢 Send Broadcast Message
        </h2>

        {/* Role Multiselect */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="font-medium text-gray-700">Select Roles</label>
            <button
              type="button"
              onClick={handleSelectAllRoles}
              className="text-sm text-blue-600 hover:underline"
            >
              {allRolesSelected ? "Deselect All" : "Select All"}
            </button>
          </div>
          <Select
            isMulti
            styles={lightSelectStyles}
            options={roles}
            value={selectedRoles}
            onChange={(opts) => setSelectedRoles(opts || [])}
            placeholder="Choose one or more roles..."
          />
        </div>

        {/* Users Multiselect */}
        {selectedRoles.length > 0 && users.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="font-medium text-gray-700">Select Users</label>
              <button
                type="button"
                onClick={handleSelectAllUsers}
                className="text-sm text-blue-600 hover:underline"
              >
                {allUsersSelected ? "Deselect All" : "Select All"}
              </button>
            </div>
            <Select
              isMulti
              styles={lightSelectStyles}
              options={users.map((u) => ({
                label: `${u.name} (${u.phone})`,
                value: u.phone,
              }))}
              value={selectedUsers}
              onChange={(opts) => setSelectedUsers(opts || [])}
              placeholder="Choose one or more users..."
            />
          </div>
        )}

        {/* Message Box */}
        <textarea
          rows={4}
          placeholder="Type your broadcast message..."
          className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all shadow-md hover:shadow-lg"
        >
          Send Broadcast
        </button>
      </div>
    </div>
  );
}
