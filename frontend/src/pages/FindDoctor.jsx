import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext";

function FindDoctor() {
  const { user } = useAuth(); // Get user token from AuthContext
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await api.get("/api/doctors/", {
        headers: {
          "Authorization": `Bearer ${user?.token}`, // Secure API call
        },
      });

      setDoctors(response.data);
      setFilteredDoctors(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch doctors. Please try again.");
      setLoading(false);
    }
  };

  // Filter doctors based on search input
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    if (!term) {
      setFilteredDoctors(doctors); // Reset to all doctors
    } else {
      setFilteredDoctors(
        doctors.filter((doc) =>
          doc.specialty.toLowerCase().includes(term) ||
          doc.first_name.toLowerCase().includes(term) ||
          doc.last_name.toLowerCase().includes(term)
        )
      );
    }
  };

  // Select doctor and navigate to booking page with doctorId
  const handleSelectDoctor = (doctor) => {
    navigate("/appointments", { state: { doctorId: doctor.user_id } });
  };

  if (loading) return <p>Loading doctors...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="find-doctor-container-my">
      <h2>Find a Doctor</h2>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search by specialty or name..."
        value={searchTerm}
        onChange={handleSearch}
        className="doctor-search-input"
      />

      {/* Doctor List */}
      <div className="doctor-list">
        {filteredDoctors.length > 0 ? (
          filteredDoctors.map((doc) => (
            <div key={doc.user_id} className="doctor-card">
              <h3>{doc.first_name} {doc.last_name}</h3>
              <p><strong>Specialty:</strong> {doc.specialty}</p>
              <p><strong>Experience:</strong> {doc.years_experience} years</p>
              <p><strong>License:</strong> {doc.license_number}</p>
              <p><strong>Bio:</strong> {doc.bio}</p>
              <button onClick={() => handleSelectDoctor(doc)}>Select</button>
            </div>
          ))
        ) : (
          <p>No doctors found.</p>
        )}
      </div>
    </div>
  );
}

export default FindDoctor;
