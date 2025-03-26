import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";
import "../styles/register.css"; // mport improved styles
import "../styles/buttons.css";
import "../styles/forms.css";

function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("patient"); // Default role
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/user/register/", { email, password, phone, role });

            if (response.status === 201) {
                navigate("/login"); // Redirect to login after successful registration
            }
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleRegister}>
                    <div className="input-field">
                        <input type="email" className="input-field" placeholder="Email" 
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="input-field">
                        <input type="password" className="input-field" placeholder="Password" 
                         value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <input type="tel" className="input-field" placeholder="Phone" 
                        value={phone} onChange={(e) => setPhone(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label>Role</label>
                        <select className="register-select" value={role} 
                            onChange={(e) => setRole(e.target.value)}>
                            <option value="patient">Patient</option>
                            <option value="doctor">Doctor</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" className="register-button">Create Account</button>
                </form>
                
                <p className="register-redirect">
                    Already have an account?
                    <Link to="/login" className="register-link"> Log in here</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;
