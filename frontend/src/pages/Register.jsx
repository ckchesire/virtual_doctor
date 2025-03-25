import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api"


function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("patient"); // Default role
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/user/register/", 
                { email, password, role}
            );
            if (response.status === 201) {
                navigate("/login"); // Redirect to login after successful registration
            }
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: "red"}}>{error}</p>}
            <form onSubmit={handleRegister}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

                <label>Role:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                </select>

                <button type="submit">Register</button>
            </form>
            <p>Already have an account? <a href="/login">Login here</a></p>
        </div>
    );
}

export default Register;