import { useEffect, useState } from "react";
import api from "../api";

function Profile() {
  // Stores the entire user profile object
  const [profile, setProfile] = useState(null);

  // Manages form input values
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    date_of_birth: "",
    gender: "",
    emergency_contact: "",
    medical_history: "",
  });

  // Toggles between view and edit modes
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/api/profile/");
      setProfile(response.data);

      // Extract patient-specific details
      const patientData = response.data.patient_profile || {};
      setFormData({
        first_name: patientData.first_name || "",
        last_name: patientData.last_name || "",
        date_of_birth: patientData.date_of_birth || "",
        gender: patientData.gender || "",
        emergency_contact: patientData.emergency_contact || "",
        medical_history: patientData.medical_history ?? "NA", // Fix null values
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        emergency_contact: formData.emergency_contact,
        medical_history: formData.medical_history,
      };

      const response = await api.patch("/api/profile/", updateData);
      setProfile(response.data); // Update profile after save
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div>
      <h2>User Profile</h2>
      {profile ? (
        <div>
          {!isEditing ? (
            <>
              <p><strong>Name:</strong> {formData.first_name} {formData.last_name}</p>
              <p><strong>Date of Birth:</strong> {formData.date_of_birth || "N/A"}</p>
              <p><strong>Gender:</strong> {formData.gender || "N/A"}</p>
              <p><strong>Emergency Contact:</strong> {formData.emergency_contact || "N/A"}</p>
              <p><strong>Medical History:</strong> {formData.medical_history}</p>

              <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </>
          ) : (
            <form onSubmit={handleUpdate}>
              <label>First Name:</label>
              <input type="text" name="first_name" value={formData.first_name} onChange={handleChange} required />

              <label>Last Name:</label>
              <input type="text" name="last_name" value={formData.last_name} onChange={handleChange} required />

              <label>Date of Birth:</label>
              <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} required />

              <label>Gender:</label>
              <select name="gender" value={formData.gender} onChange={handleChange} required>
                <option value="">Select...</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <label>Emergency Contact:</label>
              <input type="text" name="emergency_contact" value={formData.emergency_contact} onChange={handleChange} required />

              <label>Medical History:</label>
              <textarea name="medical_history" value={formData.medical_history} onChange={handleChange} required />

              <button type="submit">Save Changes</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          )}
        </div>
      ) : (
        <p>Loading profile...</p>
      )}
    </div>
  );
}

export default Profile;
