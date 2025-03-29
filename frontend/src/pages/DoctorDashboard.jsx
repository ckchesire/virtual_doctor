import { useEffect, useState } from "react";
import api from "../api";
import DoctorQueue from "../components/DoctorQueue";
import { Link } from "react-router-dom";
import { Calendar, Users, Clock } from "lucide-react";
import "../styles/doctor-dashboard.css";

function DoctorDashboard() {
  const [patients, setPatients] = useState([]);
  const [consultations, setConsultations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const patientsRes = await api.get("/api/patients/");
      const consultationsRes = await api.get("/api/consultations/");
      setPatients(patientsRes.data);
      setConsultations(consultationsRes.data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching doctor data:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-indicator">
          <Clock className="loading-icon" />
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h2 className="dashboard-title">Doctor Dashboard</h2>
          <div className="status-badge">
            <span className="status-indicator">Online</span>
          </div>
        </div>

        {/* Doctor Queue Component */}
        <div className="queue-section">
          <div className="section-header">
            <Clock className="section-icon clock" />
            <h3 className="section-title">Consultation Queue</h3>
          </div>
          <DoctorQueue />
        </div>

        <div className="dashboard-grid">
          {/* My Patients Section */}
          <div className="dashboard-card">
            <div className="section-header">
              <Users className="section-icon users" />
              <h3 className="section-title">My Patients</h3>
            </div>
            {patients.length > 0 ? (
              <div className="patient-list">
                {patients.map((patient) => (
                  <div key={patient.id} className="patient-item">
                    <div className="patient-info">
                      <h4 className="patient-name">
                        {patient.first_name} {patient.last_name}
                      </h4>
                      <p className="patient-gender">{patient.gender}</p>
                    </div>
                    <button className="view-details-button">
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Users className="empty-icon" />
                <p className="empty-text">No assigned patients yet.</p>
              </div>
            )}
          </div>

          {/* Upcoming Consultations Section */}
          <div className="dashboard-card">
            <div className="section-header">
              <Calendar className="section-icon calendar" />
              <h3 className="section-title">Upcoming Consultations</h3>
            </div>
            {consultations.length > 0 ? (
              <div className="consultation-list">
                {consultations.map((consultation) => (
                  <div
                    key={consultation.consultation_id}
                    className="consultation-item"
                  >
                    <div className="consultation-content">
                      <div className="consultation-info">
                        <h4 className="consultation-patient">
                          {consultation.patient_name}
                        </h4>
                        <div className="consultation-time">
                          <Clock className="time-icon" />
                          <span>
                            {new Date(consultation.start_time).toLocaleString()}
                          </span>
                        </div>
                        <span className={`status-badge ${consultation.status}`}>
                          {consultation.status}
                        </span>
                      </div>
                      {consultation.status === "pending" && (
                        <Link
                          to={`/api/consultations/${consultation.consultation_id}`}
                          className="start-consultation-button"
                        >
                          Start Consultation
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <Calendar className="empty-icon" />
                <p className="empty-text">No upcoming consultations.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorDashboard;