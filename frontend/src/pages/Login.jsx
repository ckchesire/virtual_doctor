import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await api.post("/api/token/", { email, password });
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            localStorage.setItem(REFRESH_TOKEN, response.data.refresh);
            navigate("/dashboard"); // redirect to dashboard on success
        } catch (err) {
            setError("Invalid credentails. Please try again.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red"}}>{error}</p>}
            <form onSubmit={handleLogin}>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required/>

                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required/>

                <button type="submit">Login</button>
            </form>
            <p>Don't have an account? <a href="register">Register here</a></p>
        </div>
    );
}

export default Login;