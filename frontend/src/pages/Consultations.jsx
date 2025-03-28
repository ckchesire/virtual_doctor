import { useEffect, useState } from "react";
import api from "../api";
import "../styles/consultation.css";


function Consultations() {
  const [consultations, setConsultations] = useState([]);
  const [appointment, setAppointment] = useState("");
  const [status, setStatus] = useState("ongoing");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await api.get("/api/consultations/");
        setConsultations(response.data);
      } catch (error) {
        console.error("Error fetching consultations:", error);
      }
    };
    fetchConsultations();
  }, []);

  const handleStartConsultation = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/consultations/", {
        appointment,
        start_time: new Date().toISOString(),
        status,
      });
      setConsultations([...consultations, response.data]); // Add to list
      setAppointment(""); // Reset input field
    } catch (error) {
      console.error("Error starting consultation:", error);
    }
  };

  const handleCompleteConsultation = async (id) => {
    try {
      const response = await api.patch(`/api/consultations/${id}/`, {
        end_time: new Date().toISOString(),
        status: "completed",
        consultation_notes: notes,
      });

      // Update consultations list
      setConsultations(
        consultations.map((c) =>
          c.consultation_id === id ? response.data : c
        )
      );
      setNotes(""); // Reset notes field
    } catch (error) {
      console.error("Error completing consultation:", error);
    }
  };

  return (
    <div className="consultations-container">
      <h2 className="consultations-header">Your Consultations</h2>
      <ul className="consultations-list">
        {consultations.map((c) => (
          <li key={c.consultation_id} className="consultation-item">
            <span className="consultation-details">
              <strong>Appointment:</strong> {c.appointment} - <strong>Status:</strong> {c.status}
            </span>
            <span className="consultation-notes">
              <strong>Notes:</strong> {c.consultation_notes || "N/A"}
            </span>
            {c.status === "ongoing" && (
              <button
                className="complete-btn"
                onClick={() => handleCompleteConsultation(c.consultation_id)}
              >
                Complete Consultation
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="form-section">
        <h3 className="consultations-header">Start New Consultation</h3>
        <form onSubmit={handleStartConsultation} className="consultation-form">
          <label>Appointment ID:</label>
          <input
            type="text"
            value={appointment}
            onChange={(e) => setAppointment(e.target.value)}
            required
            placeholder="Enter appointment ID"
          />
          <button type="submit" className="start-btn">
            Start Consultation
          </button>
        </form>
      </div>

      <div className="form-section">
        <h3 className="consultations-header">Complete Consultation</h3>
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          required
          placeholder="Enter consultation notes"
        />
      </div>
    </div>
  );
}

export default Consultations;
