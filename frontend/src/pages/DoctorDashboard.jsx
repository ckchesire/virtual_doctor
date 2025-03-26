import { useEffect, useState } from "react";
import api from "../api";

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

  if (isLoading) return <p className="text-center text-gray-500">Loading dashboard...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Doctor Dashboard</h2>

      <h3 className="text-xl font-semibold">My Patients</h3>
      <ul className="list-disc pl-5">
        {patients.length > 0 ? (
          patients.map((patient) => (
            <li key={patient.id} className="border p-2 rounded my-2">
              {patient.first_name} {patient.last_name} - {patient.gender}
            </li>
          ))
        ) : (
          <p>No assigned patients yet.</p>
        )}
      </ul>

      <h3 className="text-xl font-semibold mt-6">Upcoming Consultations</h3>
      <ul className="list-disc pl-5">
        {consultations.length > 0 ? (
          consultations.map((consultation) => (
            <li key={consultation.consultation_id} className="border p-2 rounded my-2">
              <strong>Patient:</strong> {consultation.patient_name} <br />
              <strong>Status:</strong> {consultation.status} <br />
              <strong>Start Time:</strong> {new Date(consultation.start_time).toLocaleString()} <br />
            </li>
          ))
        ) : (
          <p>No upcoming consultations.</p>
        )}
      </ul>
    </div>
  );
}

export default DoctorDashboard;
