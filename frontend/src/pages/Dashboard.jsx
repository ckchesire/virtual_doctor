import React, { useEffect, useState } from 'react';
import { 
  User, 
  Calendar, 
  MessageCircle, 
  FileText, 
  Search, 
  Stethoscope 
} from 'lucide-react';
import '../styles/dashboard.css';

function Dashboard() {
  const [userName, setUserName] = useState('John Doe');
  const [appointments, setAppointments] = useState([
    { 
      id: 1, 
      doctor: "Dr. Sarah Johnson", 
      type: "General Consultation", 
      date: "March 8, 2025", 
      time: "10:00 AM" 
    }
  ]);

  const [recentConsultations, setRecentConsultations] = useState([
    {
      id: 1,
      doctor: "Dr. Michael Chen",
      type: "Follow-up Consultation",
      date: "March 1, 2025",
      status: "Completed"
    }
  ]);

  const quickActions = [
    { 
      icon: <Stethoscope className="text-3xl text-blue-600" />, 
      label: "Find Doctor", 
      bgColor: "bg-blue-50" 
    },
    { 
      icon: <Search className="text-3xl text-red-600" />, 
      label: "Symptom Check", 
      bgColor: "bg-red-50" 
    },
    { 
      icon: <FileText className="text-3xl text-green-600" />, 
      label: "Medical Records", 
      bgColor: "bg-green-50" 
    },
    { 
      icon: <MessageCircle className="text-3xl text-purple-600" />, 
      label: "Message Doctor", 
      bgColor: "bg-purple-50" 
    }
  ];

  const healthReminders = [
    "Remember to take your medication daily",
    "Next follow-up: In 2 weeks"
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">
          Welcome, {userName}
        </h1>
        <div className="profile-section">
          <User className="profile-icon" />
          <span className="profile-text">Profile</span>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Upcoming Appointments */}
        <div className="dashboard-card appointments-card">
          <h2 className="card-title">Upcoming Appointments</h2>
          {appointments.map(appt => (
            <div key={appt.id} className="appointment-item">
              <div className="appointment-details">
                <h3 className="doctor-name">{appt.doctor}</h3>
                <p className="appointment-type">{appt.type}</p>
                <p className="appointment-datetime">
                  {appt.date} • {appt.time}
                </p>
              </div>
              <button className="consultation-btn">
                Join Consultation
              </button>
            </div>
          ))}
          <button className="book-appointment-btn">
            <a href="/appointments" >Book New Appointment</a>
          </button>
        </div>

        {/* Quick Actions */}
        <div className="dashboard-card quick-actions-card">
          <h2 className="card-title">Quick Actions</h2>
          <div className="quick-actions-grid">
            {quickActions.map((action, index) => (
              <div 
                key={index} 
                className={`quick-action-item ${action.bgColor}`}
              >
                {action.icon}
                <span className="quick-action-label">
                  {action.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Consultations */}
        <div className="dashboard-card consultations-card">
          <h2 className="card-title">Recent Consultations</h2>
          {recentConsultations.map(consult => (
            <div 
              key={consult.id} 
              className="consultation-item"
            >
              <div className="consultation-details">
                <h3 className="doctor-name">{consult.doctor}</h3>
                <p className="consultation-type">{consult.type}</p>
                <p className="consultation-date">{consult.date}</p>
              </div>
              <span className="consultation-status">
                {consult.status}
              </span>
            </div>
          ))}
        </div>

        {/* Health Reminders */}
        <div className="dashboard-card reminders-card">
          <h2 className="card-title">Health Reminders</h2>
          {healthReminders.map((reminder, index) => (
            <div 
              key={index} 
              className="reminder-item"
            >
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