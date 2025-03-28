import { useEffect, useState } from "react";
import api from "../api";
import "../styles/appointments.css";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(""); // Changed to Doctor ID
  const [datetime, setDatetime] = useState("");
  const [appointmentType, setAppointmentType] = useState("General Checkup");
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await api.get("/api/appointments/");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };
    fetchAppointments();
  }, []);

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/api/appointments/", {
        doctor: doctorId, // Use Doctor ID instead
        appointment_datetime: datetime,
        status: "scheduled",
        appointment_type: appointmentType,
        reason,
      });
      setAppointments([...appointments, response.data]);

      // Reset form fields
      setDoctorId("");
      setDatetime("");
      setAppointmentType("General Checkup");
      setReason("");
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div className="appointments-container">
      <h2 className="appointments-header">Your Appointments</h2>
      <ul className="appointments-list">
        {appointments.map((appt) => (
          <li key={appt.appointment_id} className="appointment-item">
            <span>Dr. {appt.doctor}</span> - {appt.appointment_datetime} -{" "}
            <strong>{appt.status}</strong>
          </li>
        ))}
      </ul>

      <h3 className="appointments-header">Book New Appointment</h3>
      <form onSubmit={handleBookAppointment} className="appointment-form">
        <label>Doctor ID:</label>
        <input
          type="text"
          value={doctorId}
          onChange={(e) => setDoctorId(e.target.value)}
          required
          placeholder="Enter doctor ID"
        />

        <label>Date & Time:</label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          required
        />

        <label>Appointment Type:</label>
        <select
          value={appointmentType}
          onChange={(e) => setAppointmentType(e.target.value)}
        >
          <option value="General Checkup">General Checkup</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Emergency">Emergency</option>
        </select>

        <label>Reason:</label>
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
          placeholder="Briefly describe the reason for appointment"
        />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default Appointments;
