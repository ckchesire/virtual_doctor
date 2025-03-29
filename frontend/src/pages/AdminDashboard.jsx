import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import "../styles/admin-dashboard.css";

function AdminDashboard() {
  const { user } = useAuth();
  
  // ✅ Always define hooks at the top level
  const [pendingDoctors, setPendingDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorDetails, setDoctorDetails] = useState({
    first_name: "",
    last_name: "",
    specialty: "",
    license_number: "",
    bio: "",
    years_experience: "",
  });

  useEffect(() => {
    const fetchPendingDoctors = async () => {
      try {
        const response = await api.get("/api/admin/pending-doctors/");
        setPendingDoctors(response.data);
      } catch (error) {
        console.error("Error fetching pending doctors:", error);
      }
    };
    fetchPendingDoctors();
  }, []);

  const handleApproveClick = (doctor) => {
    setSelectedDoctor(doctor);
    setDoctorDetails({ ...doctorDetails, email: doctor.email });
  };

  const handleInputChange = (e) => {
    setDoctorDetails({ ...doctorDetails, [e.target.name]: e.target.value });
  };

  const handleApproveDoctor = async (id) => {
    try {
      await api.patch(`/api/admin/approve-doctor/${id}/`, doctorDetails);
      alert("Doctor approved successfully!");
      setPendingDoctors(pendingDoctors.filter((doc) => doc.id !== id));
      setSelectedDoctor(null);
    } catch (error) {
      console.error("Error approving doctor:", error);
    }
  };

  // ✅ Move role check inside return statement (DO NOT use hooks conditionally)
  if (user?.role !== "admin") {
    return <h2>Access Denied. Admins Only.</h2>;
  }

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <h3>Pending Doctors</h3>
      <ul className="doctor-list">
        {pendingDoctors.map((doctor) => (
          <li key={doctor.id} className="doctor-item">
            <span>{doctor.email}</span>
            <button onClick={() => handleApproveClick(doctor)}>Approve</button>
          </li>
        ))}
      </ul>

      {selectedDoctor && (
        <div className="approve-form">
          <h3>Approve Doctor: {selectedDoctor.email}</h3>
          <label>First Name:</label>
          <input type="text" name="first_name" onChange={handleInputChange} required />

          <label>Last Name:</label>
          <input type="text" name="last_name" onChange={handleInputChange} required />

          <label>Specialty:</label>
          <input type="text" name="specialty" onChange={handleInputChange} required />

          <label>License Number:</label>
          <input type="text" name="license_number" onChange={handleInputChange} required />

          <label>Bio:</label>
          <textarea name="bio" onChange={handleInputChange} required />

          <label>Years of Experience:</label>
          <input type="number" name="years_experience" onChange={handleInputChange} required />

          <button onClick={() => handleApproveDoctor(selectedDoctor.id)}>Confirm Approval</button>
          <button onClick={() => setSelectedDoctor(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;
