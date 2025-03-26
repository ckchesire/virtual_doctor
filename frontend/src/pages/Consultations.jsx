import { useEffect, useState } from "react";
import api from "../api";

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
      setConsultations(consultations.map((c) =>
        c.consultation_id === id ? response.data : c
      ));
    } catch (error) {
      console.error("Error completing consultation:", error);
    }
  };

  return (
    <div>
      <h2>Your Consultations</h2>
      <ul>
        {consultations.map((c) => (
          <li key={c.consultation_id}>
            Appointment {c.appointment} - {c.status} - Notes: {c.consultation_notes || "N/A"}
            {c.status === "ongoing" && (
              <button onClick={() => handleCompleteConsultation(c.consultation_id)}>
                Complete Consultation
              </button>
            )}
          </li>
        ))}
      </ul>

      <h3>Start New Consultation</h3>
      <form onSubmit={handleStartConsultation}>
        <label>Appointment ID:</label>
        <input type="text" value={appointment} onChange={(e) => setAppointment(e.target.value)} required />

        <button type="submit">Start Consultation</button>
      </form>

      <h3>Complete Consultation</h3>
      <label>Notes:</label>
      <textarea value={notes} onChange={(e) => setNotes(e.target.value)} required />
    </div>
  );
}

export default Consultations;
