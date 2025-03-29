import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

const ConsultationActions = ({ consultationId }) => {
    const [notes, setNotes] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleEndConsultation = async () => {
        if (!window.confirm("Are you sure you want to end this consultation?")) {
            return;
        }
        
        setLoading(true);
        try {
            // Per your API documentation, this will update consultation notes
            await api.patch(`/api/consultations/${consultationId}/`, {
                consultation_notes: notes,
                status: "completed"
            });
            
            alert("Consultation ended successfully.");
            navigate("/doctor-dashboard");
        } catch (error) {
            console.error("Error ending consultation:", error);
            alert("Failed to end consultation. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="consultation-actions">
            <h3 className="text-lg font-semibold mb-2">Consultation Notes</h3>
            <textarea
                placeholder="Add consultation notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 border rounded resize-y min-h-32"
            />
            <button 
                onClick={handleEndConsultation}
                disabled={loading}
                className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
                {loading ? "Processing..." : "End Consultation"}
            </button>
        </div>
    );
};

export default ConsultationActions;