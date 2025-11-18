import React, { useState } from "react";

export default function TeacherUploadAssignment() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    teacherId: "T1234", // replace with actual logged-in teacher ID
    className: "",
    language: "English",
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Uploading...");

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => data.append(key, formData[key]));
      if (file) data.append("file", file);

      const res = await fetch("http://localhost:5000/api/assignments", {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (res.ok) {
        setStatus("✅ Assignment uploaded successfully!");
        setFormData({
          title: "",
          description: "",
          dueDate: "",
          teacherId: "T1234",
          className: "",
          language: "English",
        });
        setFile(null);
      } else {
        setStatus("❌ Upload failed: " + result.message);
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Server error during upload");
    }
  };

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md w-full max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Upload New Assignment</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder="Assignment Title"
          value={formData.title}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        ></textarea>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          name="className"
          placeholder="Class Name"
          value={formData.className}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />
        <input
          name="language"
          placeholder="Language"
          value={formData.language}
          onChange={handleChange}
          className="w-full border rounded-lg p-2"
        />

        <div className="border-dashed border-2 border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
          <label className="cursor-pointer">
            📎 Click to upload or drag & drop
            <br />
            <span className="text-gray-500 text-sm">PDF, DOC, DOCX (max 10MB)</span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Upload Assignment
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
