import React, { useEffect, useState } from "react";
import { fetchAssignments, createAssignment, deleteAssignment } from "../api/assignments";

export default function AssignmentsTab() {
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    teacherId: "123456", // replace with real user later
    className: "",
    language: "English",
  });

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    const data = await fetchAssignments();
    setAssignments(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await createAssignment(form);
    setForm({ title: "", description: "", teacherId: "123456", className: "", language: "English" });
    loadAssignments();
  }

  async function handleDelete(id) {
    await deleteAssignment(id);
    loadAssignments();
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📘 Assignments</h2>

      <form onSubmit={handleSubmit} className="space-y-3 bg-blue-50 p-4 rounded-lg shadow-md mb-6">
        <input
          className="w-full p-2 border rounded"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          className="w-full p-2 border rounded"
          placeholder="Class Name"
          value={form.className}
          onChange={(e) => setForm({ ...form, className: e.target.value })}
        />
        <select
          className="w-full p-2 border rounded"
          value={form.language}
          onChange={(e) => setForm({ ...form, language: e.target.value })}
        >
          <option>English</option>
          <option>German</option>
          <option>French</option>
          <option>Spanish</option>
          <option>Swahili</option>
          <option>Ukrainian</option>
          <option>Russian</option>
          <option>Arabic</option>
          <option>Polish</option>
          <option>Portuguese</option>
          <option>Italian</option>
          <option>Dutch</option>
          <option>Turkish</option>
          <option>Chinese</option>
        </select>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create Assignment
        </button>
      </form>

      <div>
        {assignments.map((a) => (
          <div key={a._id} className="bg-white p-3 mb-3 shadow rounded flex justify-between items-center">
            <div>
              <h3 className="font-semibold">{a.title}</h3>
              <p className="text-gray-600">{a.description}</p>
              <p className="text-sm text-gray-500">Language: {a.language}</p>
            </div>
            <button
              onClick={() => handleDelete(a._id)}
              className="text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
