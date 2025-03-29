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
            const response = await api.get("/api/consultations/", {
                params: { status: "pending" }
            });
            setPendingConsultations(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pending consultations:", error);
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
                            <h4 className="font-semibold">{consultation.patient_name}</h4>
                            <p className="text-sm text-gray-600">Scheduled: {new Date(consultation.start_time).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Reason: {consultation.reason || "Not specified"}</p>
                            <Link 
                                to={`/consultations/${consultation.consultation_id}`}
                                className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Start Consultation
                            </Link>
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