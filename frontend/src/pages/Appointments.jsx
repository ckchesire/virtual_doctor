import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../api";
import { useAuth } from "../context/AuthContext"; 
import "../styles/appointments.css";

function Appointments() {
  const location = useLocation();
  const { user } = useAuth(); // Get logged-in patient info
  const [appointments, setAppointments] = useState([]);
  const [doctorId, setDoctorId] = useState(location.state?.doctorId || ""); // Prefill doctor ID
  const [patientId, setPatientId] = useState(""); // Fetch patient ID
  const [datetime, setDatetime] = useState("");
  const [appointmentType, setAppointmentType] = useState("General Checkup");
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchPatientId(); // Fetch patient ID when page loads
  }, []);

  // Fetch logged-in patient ID
  const fetchPatientId = async () => {
    try {
      const response = await api.get("/api/profile/", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setPatientId(response.data.id); // Store patient ID
    } catch (error) {
      console.error("Error fetching patient ID:", error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const response = await api.get("/api/appointments/", {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const handleBookAppointment = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post(
        "/api/appointments/",
        {
          patient: patientId, // Use fetched patient ID
          doctor: doctorId, // Use selected doctor ID
          appointment_datetime: datetime,
          status: "scheduled",
          appointment_type: appointmentType,
          reason,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
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
