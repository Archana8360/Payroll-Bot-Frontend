import React from "react";
import { useEffect, useState } from "react";
import api from "../api/app";
import toast from "react-hot-toast";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    password: "",
  });

  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      setUsers(res.data);
    } catch {
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddUser = async () => {
    const { name, email, phone, role, password } = formData;
    if (!name || !email || !phone || !role || !password)
      return toast.error("All fields are required");

    try {
      const res = await api.post("/users", formData);
      setUsers([...users, res.data]);
      resetForm();
      toast.success("User created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user");
    }
  };

  const handleUpdateUser = async () => {
    const { name, email, phone, role } = formData;
    if (!name || !email || !phone || !role)
      return toast.error("All fields except password are required");

    try {
      const updates = { name, email, phone, role };
      const res = await api.put(`/users/${editingUserId}`, updates);
      setUsers(users.map((u) => (u._id === editingUserId ? res.data : u)));
      resetForm();
      toast.success("User updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
    }
  };

  const handleRemove = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter((u) => u._id !== id));
      toast.success("User removed");
    } catch {
      toast.error("Failed to remove user");
    }
  };

  const handleEditClick = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      password: "",
    });
    setEditingUserId(user._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({ name: "", email: "", phone: "", role: "", password: "" });
    setEditingUserId(null);
    setIsEditing(false);
    setShowModal(false);
  };

  return (
    <>
      {/* Main Page Content */}
      <div
        className={`bg-gray-50 min-h-screen p-8 transition-all duration-300 ${
          showModal ? "blur-sm pointer-events-none" : ""
        }`}
      >
        <div className="bg-white shadow rounded-lg p-6 max-w-5xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              User Management
            </h2>
            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              + Add User
            </button>
          </div>

          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Email</th>
                <th className="border p-3 text-left">Phone</th>
                <th className="border p-3 text-left">Role</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length ? (
                users.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="border p-3">{user.name}</td>
                    <td className="border p-3">{user.email}</td>
                    <td className="border p-3">{user.phone}</td>
                    <td className="border p-3 capitalize">{user.role}</td>
                    <td className="border p-3 text-center flex justify-center gap-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition-colors"
                        onClick={() => handleEditClick(user)}
                      >
                        Edit
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                        onClick={() => handleRemove(user._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="border p-4 text-center text-gray-500 italic"
                  >
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Update User Modal */}
      <div
        className={`fixed inset-0 z-50 flex justify-center items-center transition-opacity duration-300 ease-in-out ${
          showModal ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-transparent"
          onClick={resetForm}
        ></div>

        <div
          className={`bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative transition-all duration-300 ease-in-out ${
            showModal ? "scale-100 opacity-100" : "scale-95 opacity-0"
          }`}
        >
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            {isEditing ? "Update User" : "Create New User"}
          </h3>

          <div className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full border rounded p-2"
              value={formData.name}
              onChange={handleInputChange}
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="w-full border rounded p-2"
              value={formData.email}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              className="w-full border rounded p-2"
              value={formData.phone}
              onChange={handleInputChange}
            />
            <select
              name="role"
              className="w-full border rounded p-2"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="">Select Role</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="employee">Employee</option>
            </select>

            {!isEditing && (
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full border rounded p-2"
                value={formData.password}
                onChange={handleInputChange}
              />
            )}
          </div>

          <div className="flex justify-end gap-3 mt-5">
            <button
              className="px-4 py-2 rounded border border-gray-300 hover:bg-gray-100 transition-colors"
              onClick={resetForm}
            >
              Cancel
            </button>
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              onClick={isEditing ? handleUpdateUser : handleAddUser}
            >
              {isEditing ? "Update" : "Create"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
