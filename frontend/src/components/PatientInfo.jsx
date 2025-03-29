const PatientInfo = ({ patient }) => {
    return (
        <div className="patient-info">
            <h3 className="text-lg font-semibold mb-2">Patient Information</h3>
            <div className="space-y-2">
                <p><strong>Name:</strong> {patient.name}</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
                <p><strong>Date of Birth:</strong> {patient.dob}</p>
                
                <div>
                    <h4 className="font-medium mt-4">Medical History</h4>
                    <p className="text-sm mt-1">{patient.medicalHistory}</p>
                </div>
                
                <div>
                    <h4 className="font-medium mt-4">Allergies</h4>
                    <p className="text-sm mt-1">{patient.allergies}</p>
                </div>
            </div>
        </div>
    );
};

export default PatientInfo;