import "./TeacherNavbar.css";
import { NavLink, Link } from "react-router-dom";

function TeacherNavbar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">{"\uD83E\uDDEA"} IIT Goa Exams</div>
      <div className="navbar-links">
        <NavLink to="/teacher-dashboard" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Dashboard
        </NavLink>
        <NavLink to="/teacher-dashboard/reports" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Reports
        </NavLink>
        <NavLink to="/teacher-dashboard/account" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          My Account
        </NavLink>
        <Link to="/" className="logout-button">Logout</Link>
      </div>
    </nav>
  );
}

export default TeacherNavbar;
