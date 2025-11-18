import axios from "axios";

const API_URL = "http://localhost:5000/api/assignments"; // adjust if using deployed backend

// ✅ CREATE an assignment (Teacher upload)
export const createAssignment = async (assignmentData) => {
  try {
    const res = await axios.post(API_URL, assignmentData);
    return res.data;
  } catch (err) {
    console.error("Error creating assignment:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ GET all assignments
export const getAllAssignments = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data;
  } catch (err) {
    console.error("Error fetching assignments:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ GET assignment by ID
export const getAssignmentById = async (id) => {
  try {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error fetching assignment:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ UPDATE an assignment
export const updateAssignment = async (id, updatedData) => {
  try {
    const res = await axios.put(`${API_URL}/${id}`, updatedData);
    return res.data;
  } catch (err) {
    console.error("Error updating assignment:", err.response?.data || err.message);
    throw err;
  }
};

// ✅ DELETE an assignment
export const deleteAssignment = async (id) => {
  try {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Error deleting assignment:", err.response?.data || err.message);
    throw err;
  }
};
