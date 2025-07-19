import "./StudentNavbar.css";
import { NavLink, Link } from "react-router-dom";

function StudentNavbar() {
  return (
    <div className="student-nav-container">
      <nav className="student-navbar">
        <div className="student-navbar-logo">{"\u{1F9D1}\u{200D}\u{1F393}"} GTA</div>
        <div className="student-navbar-links">
          <NavLink
            to="/student-dashboard"
            end
            className={({ isActive }) =>
              isActive ? "student-nav-link active" : "student-nav-link"
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/history"
            end
            className={({ isActive }) =>
              isActive ? "student-nav-link active" : "student-nav-link"
            }
          >
            History
          </NavLink>
          
          <NavLink
            to="/student-dashboard/reports"
            end
            className={({ isActive }) =>
              isActive ? "student-nav-link active" : "student-nav-link"
            }
          >
            Reports
          </NavLink>
          <Link to="/" className="student-logout-button">
            Logout
          </Link>
        </div>
      </nav>
    </div>
  );
}

export default StudentNavbar;
