import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import "./ManageFacilities.css";


const ManageFacilities = () => {
  const [facilities, setFacilities] = useState([]);
  const [newFacility, setNewFacility] = useState("");

  useEffect(() => {
    fetchFacilities();
  }, []);

  //  Fetch facilities
  const fetchFacilities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/facilities");
      setFacilities(res.data);
    } catch (err) {
      console.error("Error fetching facilities:", err);
    }
  };

  //  Add facility
  const addFacility = async (e) => {
    e.preventDefault();
    if (!newFacility.trim()) return;

    try {
      await axios.post("http://localhost:5000/api/facilities", {
        name: newFacility,
      });
      setNewFacility("");
      fetchFacilities();
    } catch (err) {
      console.error("Error adding facility:", err);
      alert("Failed to add facility");
    }
  };

  //  Delete facility
  const deleteFacility = async (id) => {
    if (!window.confirm("Are you sure you want to delete this facility?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/facilities/${id}`);
      setFacilities(facilities.filter((f) => f._id !== id));
      alert("Facility deleted successfully");
    } catch (err) {
      console.error("Error deleting facility:", err);
      alert("Failed to delete facility");
    }
  };

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />
      <div className="facilities-page">
        <div className="fm-header">
          <h2 className="fm-title">Manage Facilities</h2>
        </div>

        {/* Add Facility Form */}
        <form onSubmit={addFacility} className="fm-form">
          <input
            type="text"
            placeholder="Enter facility name"
            value={newFacility}
            onChange={(e) => setNewFacility(e.target.value)}
            className="fm-input"
          />
          <button onClick={addFacility} type="submit" className="btn btn-primary">
            Add
          </button>
        </form>

        {/* Facilities Table */}
        <div className="table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Facility Name</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {facilities.length === 0 ? (
                <tr>
                  <td colSpan="3" style={{ textAlign: "center", padding: "10px" }}>
                    No facilities found
                  </td>
                </tr>
              ) : (
                facilities.map((f, index) => (
                  <tr key={f._id}>
                    <td>{index + 1}</td>
                    <td>{f.name}</td>
                    <td>
                      <button onClick={() => deleteFacility(f._id)} className="btn-delete">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageFacilities;
