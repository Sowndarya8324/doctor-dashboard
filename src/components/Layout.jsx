import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaNotesMedical,
  FaBaby,
  FaSyringe,
  FaBell,
} from "react-icons/fa";

export default function Layout({ children }) {
  return (
    <div style={styles.container}>
      <aside style={styles.sidebar}>
        <div style={styles.logoCard}>
          <div style={styles.logoIcon}>🩺</div>
          <div>
            <div style={styles.logoTitle}>Doctor Panel</div>
            <div style={styles.logoSub}>Care Dashboard</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <NavLink to="/dashboard" style={styles.link}>
            <FaHome /> Dashboard
          </NavLink>

          <NavLink to="/patients" style={styles.link}>
            <FaUsers /> Patients
          </NavLink>

          <NavLink to="/alerts" style={styles.link}>
            <FaBell /> Alerts
          </NavLink>

          <NavLink to="/prescriptions" style={styles.link}>
            <FaNotesMedical /> Prescriptions
          </NavLink>

          <NavLink to="/birth-registration" style={styles.link}>
            <FaBaby /> Birth Registration
          </NavLink>

          <NavLink to="/vaccination-reminders" style={styles.link}>
            <FaSyringe /> Vaccination Reminder
          </NavLink>
        </nav>
      </aside>

      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#fff7fb",
  },
  sidebar: {
    width: "240px",
    background: "#fff",
    borderRight: "1px solid #f1dbe6",
    padding: "20px",
  },
  logoCard: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid #f1dbe6",
    background: "#fffafc",
    marginBottom: "20px",
  },
  logoIcon: {
    fontSize: "22px",
    background: "#ec4899",
    color: "white",
    padding: "10px",
    borderRadius: "12px",
  },
  logoTitle: {
    fontWeight: "700",
    fontSize: "16px",
    color: "#111827",
  },
  logoSub: {
    fontSize: "12px",
    color: "#64748b",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  link: ({ isActive }) => ({
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "12px 14px",
    borderRadius: "12px",
    textDecoration: "none",
    fontWeight: "600",
    fontSize: "14px",
    color: isActive ? "#fff" : "#1f2937",
    background: isActive ? "#ec4899" : "transparent",
  }),
  main: {
    flex: 1,
    padding: "30px",
  },
};