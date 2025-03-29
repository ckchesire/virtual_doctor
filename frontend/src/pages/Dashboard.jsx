import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Calendar, MessageCircle, FileText, Search, Stethoscope } from "lucide-react";
import api from "../api";
import { useAuth } from "../context/AuthContext";
import "../styles/dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth(); // Get user token from AuthContext
  const [userName, setUserName] = useState(user?.name || user?.email || "Patient");
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch Appointments from API
  const fetchAppointments = async () => {
    try {
      const response = await api.get("/api/appointments/", {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setAppointments(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch appointments. Please try again.");
      setLoading(false);
    }
  };

  const handleJoinConsultation = (status) => {
    if (status === "ongoing") {
      navigate("/consultation");
    } else {
      alert("Your consultation has not started yet.");
    }
  };

  if (loading) return <p>Loading dashboard...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Welcome, {userName}</h1>
        <div className="profile-section">
          <User className="profile-icon" />
          <span className="profile-text">Profile</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Upcoming Appointments */}
        <div className="dashboard-card appointments-card">
          <h2 className="card-title">Upcoming Appointments</h2>
          {appointments.length > 0 ? (
            appointments.map((appt) => (
              <div key={appt.appointment_id} className="appointment-item">
                <div className="appointment-details">
                  <h3 className="doctor-name">
                    Dr. {appt.doctor_first_name} {appt.doctor_last_name}
                  </h3>
                  <p className="appointment-type">{appt.appointment_type}</p>
                  <p className="appointment-datetime">
                    {new Date(appt.appointment_datetime).toLocaleString()}
                  </p>
                  <p className="appointment-id">
                    <strong>Appointment ID:</strong> {appt.appointment_id}
                  </p>
                  <p className="appointment-status">
                    <strong>Status:</strong> {appt.status}
                  </p>
                </div>
                <button 
                  className="consultation-btn"
                  onClick={() => handleJoinConsultation(appt.status)}
                >
                  Join Consultation
                </button>
              </div>
            ))
          ) : (
            <p>No upcoming appointments.</p>
          )}
          <button 
            className="book-appointment-btn"
            onClick={() => navigate("/find-doctor")}
          >
            Book an Appointment
          </button>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <h2 className="card-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {[
              { icon: <Stethoscope className="text-3xl text-blue-600" />, label: "Find Doctor", bgColor: "bg-blue-50", action: () => navigate("/find-doctor") },
              { icon: <Search className="text-3xl text-red-600" />, label: "Symptom Check", bgColor: "bg-red-50" },
              { icon: <FileText className="text-3xl text-green-600" />, label: "Medical Records", bgColor: "bg-green-50" },
              { icon: <MessageCircle className="text-3xl text-purple-600" />, label: "Message Doctor", bgColor: "bg-purple-50" }
            ].map((action, index) => (
              <div 
                key={index} 
                className={`quick-action-item ${action.bgColor}`}
                onClick={action.action}
                style={{ cursor: "pointer" }}
              >
                {action.icon}
                <span className="quick-action-label">{action.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="dashboard-card consultations-card">
          <h2 className="card-title">Recent Consultations</h2>
          <div className="consultation-item">
            <h3 className="doctor-name">Dr. Michael Chen</h3>
            <p className="consultation-type">Follow-up Consultation</p>
            <p className="consultation-date">March 1, 2025</p>
            <span className="consultation-status">Completed</span>
          </div>
        </div>

        {/* Health Reminders */}
        <div className="dashboard-card reminders-card">
          <h2 className="card-title">Health Reminders</h2>
          {["Remember to take your medication daily", "Next follow-up: In 2 weeks"].map((reminder, index) => (
            <div key={index} className="reminder-item">
              <span className="reminder-icon">🔔</span>
              <p className="reminder-text">{reminder}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
