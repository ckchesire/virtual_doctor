import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();  // Clear tokens
    navigate("/login");  //  Redirect to login page
  }, []);

  return <p>Logging out...</p>;
}

export default Logout;
