import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserInjured,
  FaClipboardList,
  FaBaby,
  FaSyringe,
} from "react-icons/fa";

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div>
          <div style={styles.brand}>
            <div style={styles.logo}>🩺</div>
            <div>
              <div style={styles.title}>Doctor Panel</div>
              <div style={styles.sub}>Care Dashboard</div>
            </div>
          </div>

          <nav style={styles.nav}>
            <NavLink to="/dashboard" style={({ isActive }) => linkStyle(isActive)}>
              <FaHome /> Dashboard
            </NavLink>

            <NavLink to="/patients" style={({ isActive }) => linkStyle(isActive)}>
              <FaUserInjured /> Patients
            </NavLink>

            <NavLink to="/prescriptions" style={({ isActive }) => linkStyle(isActive)}>
              <FaClipboardList /> Prescriptions
            </NavLink>

            <NavLink to="/birth-registration" style={({ isActive }) => linkStyle(isActive)}>
              <FaBaby /> Birth Registration
            </NavLink>

            <NavLink to="/vaccination-reminders" style={({ isActive }) => linkStyle(isActive)}>
              <FaSyringe /> Vaccination Reminder
            </NavLink>
          </nav>
        </div>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

function linkStyle(isActive) {
  return {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: "11px 14px",
    borderRadius: 12,
    textDecoration: "none",
    fontWeight: 600,
    fontSize: "15px",
    background: isActive ? "#ec4899" : "transparent",
    color: isActive ? "#fff" : "#0f172a",
    border: isActive ? "1px solid #ec4899" : "1px solid transparent",
  };
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#f8fafc",
  },
  sidebar: {
    width: 250,
    padding: 16,
    background: "#fff8fb",
    borderRight: "1px solid #f3dce8",
  },
  brand: {
    display: "flex",
    gap: 10,
    alignItems: "center",
    padding: 12,
    borderRadius: 16,
    background: "#ffffff",
    border: "1px solid #f3dce8",
    boxShadow: "0 6px 18px rgba(236,72,153,0.04)",
    marginBottom: 18,
  },
  logo: {
    width: 42,
    height: 42,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "#ec4899",
    color: "#fff",
    fontSize: 18,
  },
  title: {
    fontSize: 17,
    fontWeight: 700,
    color: "#111827",
  },
  sub: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },
  nav: {
    display: "grid",
    gap: 8,
  },
  main: {
    flex: 1,
    padding: 22,
  },
};