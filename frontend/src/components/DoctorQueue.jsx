import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api";

const DoctorQueue = () => {
    const [pendingConsultations, setPendingConsultations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingConsultations();
    }, []);

    const fetchPendingConsultations = async () => {
        try {
            // Get all consultations and filter for pending/ongoing ones
            const response = await api.get("/api/consultations/");
            const activeConsultations = response.data.filter(
                consultation => ["pending", "ongoing"].includes(consultation.status)
            );
            setPendingConsultations(activeConsultations);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending consultations:", error);
            setLoading(false);
        }
    };

    const startConsultation = async (appointmentId) => {
        try {
            setLoading(true);
            const response = await api.post("/api/consultations/create/", {
                appointment: appointmentId
            });
            
            // Navigate to the consultation room with the new consultation ID
            window.location.href = `/consultations/${response.data.consultation_id}`;
        } catch (error) {
            console.error("Error starting consultation:", error);
            alert("Failed to start the consultation. Please try again.");
            setLoading(false);
        }
    };

    if (loading) return <p>Loading consultation queue...</p>;

    return (
        <div className="doctor-queue">
            {pendingConsultations.length > 0 ? (
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                    {pendingConsultations.map((consultation) => (
                        <div key={consultation.consultation_id} className="border rounded-lg p-4 bg-white shadow-sm">
                            <h4 className="font-semibold">Appointment ID: {consultation.appointment_id}</h4>
                            <p className="text-sm text-gray-600">Started: {new Date(consultation.start_time).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Status: {consultation.status}</p>
                            
                            {consultation.status === "ongoing" ? (
                                <Link 
                                    to={`/consultations/${consultation.consultation_id}`}
                                    className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                                >
                                    Continue Consultation
                                </Link>
                            ) : (
                                <button
                                    onClick={() => startConsultation(consultation.appointment_id)}
                                    className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                    disabled={loading}
                                >
                                    Start Consultation
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500">No pending consultations in the queue.</p>
            )}
        </div>
    );
};

export default DoctorQueue;