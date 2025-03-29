import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import PatientInfo from "./PatientInfo";
import ChatBox from "./ChatBox";
import ConsultationActions from "./ConsultationActions";
import "../styles/consultation.css";

const ConsultationRoom = () => {
    const { consultationId } = useParams();
    const [consultation, setConsultation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchConsultationDetails();
    }, [consultationId]);

    const fetchConsultationDetails = async () => {
        try {
            const response = await api.get(`/api/consultations/${consultationId}/`);
            setConsultation(response.data);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching consultation details:", error);
            setError("Failed to load consultation details. Please try again.");
            setLoading(false);
        }
    };

    if (loading) return <p className="text-center mt-8">Loading consultation room...</p>;
    if (error) return <p className="text-center mt-8 text-red-500">{error}</p>;
    if (!consultation) return <p className="text-center mt-8">Consultation not found.</p>;

    return (
        <div className="consultation-room">
            <h2 className="text-2xl font-bold mb-4">Consultation Room</h2>
            
            <div className="consultation-container">
                <PatientInfo 
                    patient={{
                        name: consultation.patient_name,
                        gender: consultation.patient_gender || "Not specified",
                        dob: consultation.patient_dob || "Not specified",
                        medicalHistory: consultation.medical_history || "No medical history available",
                        allergies: consultation.allergies || "No allergies recorded"
                    }} 
                />
                
                <ChatBox 
                    consultationId={consultationId} 
                />
            </div>
            
            <ConsultationActions 
                consultationId={consultationId} 
            />
        </div>
    );
};

export default ConsultationRoom;