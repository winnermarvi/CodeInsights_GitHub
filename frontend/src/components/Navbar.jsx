import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <nav className="navbar">
            <div className="logo">
                CodeInsight AI
            </div>

            <div className="nav-links">
                <Link
                    to="/"
                    className={isActive("/") ? "active" : ""}
                >
                    Analyze
                </Link>

                <Link
                    to="/chat"
                    className={isActive("/chat") ? "active" : ""}
                >
                    Chat
                </Link>

                <Link
                    to="/impact"
                    className={isActive("/impact") ? "active" : ""}
                >
                    Impact
                </Link>

                <Link
                    to="/architecture"
                    className={isActive("/architecture") ? "active" : ""}
                >
                    Architecture
                </Link>
            </div>
        </nav>
    );
}

export default Navbar;