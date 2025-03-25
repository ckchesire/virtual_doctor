import { Link } from "react-router-dom";

function NotFound() {
    return (
    <div>
        <h2>404 - Page Not Found</h2>
        <p>The page you are looking for does not exit.</p>
        <Link to ="/">Go back to Home</Link>
    </div>
    );
}

export default NotFound;