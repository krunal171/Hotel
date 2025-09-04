// // src/pages/ManageAdmin.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageAdmin = () => {
//   const [admins, setAdmins] = useState([]);
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     isMaster: "",
//   });
//   const [error, setError] = useState("");

//   // Fetch admins
//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/admins"); // adjust API URL
//       setAdmins(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   // Handle change
//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData({
//       ...formData,
//       [name]: type === "checkbox" ? checked : value,
//     });
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation: isMaster required
//     if (formData.isMaster === "" || formData.isMaster === null) {
//       setError("Please select whether admin is Master or not.");
//       return;
//     }
//     setError("");

//     try {
//       await axios.post("http://localhost:5000/api/admin", formData);
//       fetchAdmins();
//       setFormData({ name: "", email: "", isMaster: "" });
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Manage Admins</h1>

//       {/* Form */}
//       <form onSubmit={handleSubmit} className="mb-6 border p-4 rounded">
//         <div className="mb-2">
//           <label className="block">Name</label>
//           <input
//             type="text"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             required
//             className="border px-2 py-1 w-full"
//           />
//         </div>

//         <div className="mb-2">
//           <label className="block">Email</label>
//           <input
//             type="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//             className="border px-2 py-1 w-full"
//           />
//         </div>

//         <div className="mb-2">
//           <label className="block">Is Master?</label>
//           <select
//             name="isMaster"
//             value={formData.isMaster}
//             onChange={handleChange}
//             required
//             className="border px-2 py-1 w-full"
//           >
//             <option value="">-- Select --</option>
//             <option value={true}>Yes</option>
//             <option value={false}>No</option>
//           </select>
//         </div>

//         {error && <p className="text-red-600">{error}</p>}

//         <button
//           type="submit"
//           className="bg-blue-600 text-white px-4 py-2 rounded"
//         >
//           Add Admin
//         </button>
//       </form>

//       {/* Table */}
//       <table className="w-full border">
//         <thead>
//           <tr className="bg-gray-200">
//             <th className="border px-2 py-1">Name</th>
//             <th className="border px-2 py-1">Email</th>
//             <th className="border px-2 py-1">Is Master</th>
//           </tr>
//         </thead>
//         <tbody>
//           {admins.map((admin) => (
//             <tr key={admin._id}>
//               <td className="border px-2 py-1">{admin.name}</td>
//               <td className="border px-2 py-1">{admin.email}</td>
//               <td className="border px-2 py-1">
//                 {admin.isMaster ? "Yes" : "No"}
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ManageAdmin;


// // src/pages/ManageAdmin.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageAdmin = () => {
//   const [admins, setAdmins] = useState([]);
//   const [formData, setFormData] = useState({
//     email: "",
//     isMaster: "",
//   });
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Get current admin info from localStorage (or context/state management)
//   const getCurrentAdmin = () => {
//     // Assuming you store admin info after login
//     const adminData = localStorage.getItem('adminData');
//     if (adminData) {
//       return JSON.parse(adminData);
//     }
//     return null;
//   };

//   const currentAdmin = getCurrentAdmin();

//   // Fetch admins
//   useEffect(() => {
//     if (currentAdmin && currentAdmin.isMaster) {
//       fetchAdmins();
//     }
//   }, [currentAdmin]);

//   const fetchAdmins = async () => {
//     if (!currentAdmin || !currentAdmin._id) {
//       setError("Please login first");
//       return;
//     }

//     try {
//       setLoading(true);
//       const res = await axios.get(
//         `http://localhost:5000/api/admin/all-admins?requesterId=${currentAdmin._id}`
//       );

//       if (res.data && res.data.admins) {
//         setAdmins(res.data.admins);
//       }
//       setError("");
//     } catch (err) {
//       console.error('Fetch admins error:', err);
//       setError(err.response?.data?.message || "Failed to fetch admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle change
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });

//     // Clear errors when user starts typing
//     if (error) setError("");
//     if (success) setSuccess("");
//   };

//   // Submit
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     // Validation
//     if (!formData.email.trim()) {
//       setError("Email is required");
//       return;
//     }

//     if (formData.isMaster === "" || formData.isMaster === null) {
//       setError("Please select whether admin is Master or not");
//       return;
//     }

//     if (!currentAdmin || !currentAdmin._id) {
//       setError("Please login first");
//       return;
//     }

//     if (!currentAdmin.isMaster) {
//       setError("Only master admin can add new admins");
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       const payload = {
//         email: formData.email.trim().toLowerCase(),
//         isMaster: formData.isMaster === 'true', // Convert string to boolean
//         requesterId: currentAdmin._id
//       };

//       await axios.post("http://localhost:5000/api/admin/add-admin", payload);

//       setSuccess("Admin added successfully!");
//       setFormData({ email: "", isMaster: "" });
//       fetchAdmins(); // Refresh the list

//     } catch (err) {
//       console.error('Add admin error:', err);
//       setError(err.response?.data?.message || "Failed to add admin");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete admin
//   const handleDelete = async (adminId) => {
//     if (!currentAdmin || !currentAdmin._id || !currentAdmin.isMaster) {
//       setError("Only master admin can delete admins");
//       return;
//     }

//     if (currentAdmin._id === adminId) {
//       setError("You cannot delete yourself");
//       return;
//     }

//     if (!window.confirm("Are you sure you want to delete this admin?")) {
//       return;
//     }

//     try {
//       setLoading(true);
//       setError("");
//       setSuccess("");

//       await axios.delete("http://localhost:5000/api/admin/delete-admin", {
//         data: {
//           adminId: adminId,
//           requesterId: currentAdmin._id
//         }
//       });

//       setSuccess("Admin deleted successfully!");
//       fetchAdmins(); // Refresh the list

//     } catch (err) {
//       console.error('Delete admin error:', err);
//       setError(err.response?.data?.message || "Failed to delete admin");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Check if current user is master admin
//   if (!currentAdmin) {
//     return (
//       <div className="p-6">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//           Please login first to access this page.
//         </div>
//       </div>
//     );
//   }

//   if (!currentAdmin.isMaster) {
//     return (
//       <div className="p-6">
//         <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
//           Only master admin can access this page.
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Manage Admins</h1>

//       {/* Add Admin Form */}
//       <div className="mb-8 bg-white border rounded-lg p-6 shadow-sm">
//         <h2 className="text-lg font-semibold mb-4">Add New Admin</h2>

//         <form onSubmit={handleSubmit}>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Email *
//             </label>
//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//               placeholder="Enter admin email"
//             />
//           </div>

//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               Is Master Admin? *
//             </label>
//             <select
//               name="isMaster"
//               value={formData.isMaster}
//               onChange={handleChange}
//               required
//               disabled={loading}
//               className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
//             >
//               <option value="">-- Select --</option>
//               <option value="true">Yes (Master Admin)</option>
//               <option value="false">No (Regular Admin)</option>
//             </select>
//           </div>

//           {error && (
//             <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//               {error}
//             </div>
//           )}

//           {success && (
//             <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
//               {success}
//             </div>
//           )}

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded font-medium disabled:bg-blue-300 disabled:cursor-not-allowed"
//           >
//             {loading ? "Adding..." : "Add Admin"}
//           </button>
//         </form>
//       </div>

//       {/* Admins List */}
//       <div className="bg-white border rounded-lg shadow-sm">
//         <div className="px-6 py-4 border-b">
//           <h2 className="text-lg font-semibold">All Admins</h2>
//         </div>

//         {loading && admins.length === 0 ? (
//           <div className="p-6 text-center">Loading admins...</div>
//         ) : admins.length === 0 ? (
//           <div className="p-6 text-center text-gray-500">No admins found</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Role
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Created At
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-200">
//                 {admins.map((admin) => (
//                   <tr key={admin._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       {admin.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
//                           admin.isMaster
//                             ? "bg-purple-100 text-purple-800"
//                             : "bg-green-100 text-green-800"
//                         }`}
//                       >
//                         {admin.isMaster ? "Master Admin" : "Regular Admin"}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                       {admin.createdAt
//                         ? new Date(admin.createdAt).toLocaleDateString()
//                         : "N/A"}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       {admin._id !== currentAdmin._id ? (
//                         <button
//                           onClick={() => handleDelete(admin._id)}
//                           disabled={loading}
//                           className="text-red-600 hover:text-red-900 disabled:text-red-300"
//                         >
//                           Delete
//                         </button>
//                       ) : (
//                         <span className="text-gray-400">You</span>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ManageAdmin;



// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const ManageAdmin = () => {
//   const [admins, setAdmins] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchAdmins();
//   }, []);

//   const fetchAdmins = async () => {
//     try {
//       setLoading(true);

//       // Replace with a real master admin ID from your database
//       const masterId = "688d14a2a4d8579a0c9bf18a";

//       const res = await axios.get(`http://localhost:5000/api/admin/all-admins?requesterId=${masterId}`);

//       console.log('Response:', res.data);

//       if (res.data.admins) {
//         setAdmins(res.data.admins);
//       }

//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch admins");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">All Admins</h1>

//       {loading && <div>Loading...</div>}
//       {error && <div className="text-red-600">Error: {error}</div>}

//       {admins.length > 0 && (
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2">Email</th>
//               <th className="border p-2">Role</th>
//             </tr>
//           </thead>
//           <tbody>
//             {admins.map((admin) => (
//               <tr key={admin._id}>
//                 <td className="border p-2">{admin.email}</td>
//                 <td className="border p-2">
//                   {admin.isMaster ? "Master Admin" : "Regular Admin"}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// };

// export default ManageAdmin;



import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import "./ManageAdmin.css";


const ManageAdmin = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);

      // Get logged-in admin from localStorage (using "admin" key like your sidebar)
      const adminData = localStorage.getItem('admin');

      // if (!adminData) {
      //   setError("Please login first");
      //   return;
      // }

      const currentAdmin = JSON.parse(adminData);

      // if (!currentAdmin._id) {
      //   setError("Invalid admin data");
      //   return;
      // }

      if (!currentAdmin.isMaster) {
        setError("Only master admin can view this page");
        return;
      }

      console.log('Using admin ID:', currentAdmin._id);

      // Use the logged-in admin's ID
      const res = await axios.get(`http://localhost:5000/api/admin/all-admins?requesterId=${currentAdmin._id}`);

      console.log('Response:', res.data);

      if (res.data.admins) {
        setAdmins(res.data.admins);
      }

    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || "Failed to fetch admins");
    } finally {
      setLoading(false);
    }
  };

  // const deleteAdmin = async (id) => {
  //   if (window.confirm('Are you sure you want to delete this admin?')) {
  //     try {
  //       await axios.delete(`http://localhost:5000/api/admin/${id}`);
  //       fetchAdmins(); // Refresh list
  //     } catch (err) {
  //       console.error('Delete failed');
  //       alert('Failed to delete room');
  //     }
  //   }
  // };

  // const deleteAdmin = async (adminId) => {
  //   try {
  //     // requesterId = master admin ka ID (jo login hai uska _id)
  //     const requesterId = localStorage.getItem("adminId");

  //     await axios.delete("http://localhost:5000/api/admin/delete", {
  //       data: { adminId, requesterId }
  //     });

  //     alert("Admin deleted successfully ");

  //     // refresh admins list after delete
  //     setAdmins(prevAdmins => prevAdmins.filter(admin => admin._id !== adminId));

  //   } catch (error) {
  //     console.error("Error deleting admin:", error);
  //     alert(error.response?.data?.message || "Something went wrong");
  //   }
  // };


  // const deleteAdmin = async (adminId) => {
  //   try {
  //     const requesterId = localStorage.getItem("adminId"); //  yaha se logged in admin ka id lo
  //     const response = await axios.delete(`http://localhost:5000/api/admin/${adminId}`, {
  //       data: { requesterId }   //  backend ko dono bhejna hoga
  //     });

  //     alert(response.data.message);

  //     // delete ke baad list refresh kar do
  //     setAdmins(admins.filter((a) => a._id !== adminId));
  //   } catch (err) {
  //     console.error(err);
  //     alert("Failed to delete admin");
  //   }
  // };

  const deleteAdmin = async (adminId) => {
  try {
    const adminData = localStorage.getItem('admin');
    const currentAdmin = adminData ? JSON.parse(adminData) : null;
    const requesterId = currentAdmin?._id;

    if (!requesterId) {
      alert('You must be logged in as a master admin to delete.');
      return;
    }

    // Send requesterId as query param
    const response = await axios.delete(
      `http://localhost:5000/api/admin/${adminId}?requesterId=${requesterId}`
    );

    alert(response.data.message);
    setAdmins(admins.filter((a) => a._id !== adminId));
  } catch (err) {
    console.error(err);
    alert(err.response?.data?.message || "Failed to delete admin");
  }
};


  return (
    <div style={{ display: 'flex' }}>
      <AdminSidebar />
      <div className="manage-admins-page">
        <div className="ma-header">
          <h1 className="ma-title">Manage Admins</h1>
          <button className="btn btn-primary" onClick={() => window.location.href = '/admin/add-admin'}>Add Admin</button>
        </div>
          {loading && <div>Loading...</div>}
          {error && <div className="text-red-600 bg-red-100 p-3 rounded mb-4">Error: {error}</div>}
          {admins.length > 0 && (
            <div className="table-card">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr key={admin._id}>
                      <td>{admin.email}</td>
                      <td>
                        <span className={admin.isMaster ? 'role-pill role-master' : 'role-pill role-regular'}>
                          {admin.isMaster ? "Master Admin" : "Regular Admin"}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => deleteAdmin(admin._id)} className="btn-delete">
                          <FaTrash /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {admins.length === 0 && !loading && !error && (
            <div className="text-gray-500 text-center p-6">No admins found</div>
          )}
      </div>
    </div>
  );
};

export default ManageAdmin;