import { useEffect, useState } from "react";
import api from "../api";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState("");
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
        doctor,
        appointment_datetime: datetime,
        status: "scheduled",
        appointment_type: appointmentType,
        reason,
      });
      setAppointments([...appointments, response.data]); // Add new appointment to list
    } catch (error) {
      console.error("Error booking appointment:", error);
    }
  };

  return (
    <div>
      <h2>Your Appointments</h2>
      <ul>
        {appointments.map((appt) => (
          <li key={appt.appointment_id}>
            Dr. {appt.doctor} - {appt.appointment_datetime} - {appt.status}
          </li>
        ))}
      </ul>

      <h3>Book New Appointment</h3>
      <form onSubmit={handleBookAppointment}>
        <label>Doctor ID:</label>
        <input type="text" value={doctor} onChange={(e) => setDoctor(e.target.value)} required />

        <label>Date & Time:</label>
        <input type="datetime-local" value={datetime} onChange={(e) => setDatetime(e.target.value)} required />

        <label>Appointment Type:</label>
        <select value={appointmentType} onChange={(e) => setAppointmentType(e.target.value)}>
          <option value="General Checkup">General Checkup</option>
          <option value="Follow-up">Follow-up</option>
          <option value="Emergency">Emergency</option>
        </select>

        <label>Reason:</label>
        <textarea value={reason} onChange={(e) => setReason(e.target.value)} required />

        <button type="submit">Book Appointment</button>
      </form>
    </div>
  );
}

export default Appointments;
