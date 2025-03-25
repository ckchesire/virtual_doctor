import { useEffect, useState } from "react";
import api from "../api";

function Dashboard() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/api/profile/");
                setUser(response.data);
            } catch (error) {
                console.log("Error fetching profile:", error);
            }
        };
        fetchProfile();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            {user ? <p>Welcome, {user.email}!</p> : <p> Loading...</p>}
        </div>
    );

}

export default Dashboard;