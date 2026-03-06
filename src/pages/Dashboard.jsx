import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { COLORS } from "../theme/colors";
import { api } from "../services/api";
import StatCard from "../components/StatCard";

export default function Dashboard() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  const fetchSummary = async () => {
    try {
      setLoading(true);
      setErrorMsg("");
      const res = await api.get("/api/summary");
      const payload = res.data?.data ? res.data.data : res.data;
      setData(payload);
    } catch (err) {
      console.log(err);
      setErrorMsg("Backend connect ஆகல. Backend running இருக்கா check பண்ணு.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const totalPatients = data?.totalPatients ?? 0;
  const highRisk = data?.highRisk ?? 0;
  const alerts = data?.alerts ?? 0;
  const prescriptions = data?.prescriptions ?? 0;

  return (
    <div>
      <h1 style={styles.title}>Dashboard Overview</h1>
      <p style={styles.subtitle}>Quick summary of patients, alerts and prescriptions</p>

      {loading && <p style={{ color: COLORS.gray }}>Loading...</p>}

      {!loading && errorMsg && (
        <div style={styles.errorBox}>
          <p style={{ margin: 0, color: "#be123c" }}>{errorMsg}</p>
          <button onClick={fetchSummary} style={styles.btn}>Retry</button>
        </div>
      )}

      {!loading && !errorMsg && (
        <div style={styles.grid}>
          <StatCard title="Total Patients" value={totalPatients} bg="#dbeafe" onClick={() => navigate("/patients")} />
          <StatCard title="High Risk" value={highRisk} bg="#fef3c7" onClick={() => navigate("/patients?risk=High")} />
          <StatCard title="New Alerts" value={alerts} bg="#ede9fe" onClick={() => navigate("/alerts")} />
          <StatCard title="New Prescriptions" value={prescriptions} bg="#d1fae5" onClick={() => navigate("/prescriptions")} />
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { color: COLORS.primary, marginBottom: 8, fontSize: "30px", fontWeight: 700 },
  subtitle: { color: COLORS.gray, marginTop: 0, marginBottom: 22, fontSize: "15px" },
  grid: { display: "flex", gap: 18, flexWrap: "wrap" },
  errorBox: {
    background: "#fff1f2",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #fecdd3",
    maxWidth: "540px",
  },
  btn: {
    marginTop: "10px",
    background: COLORS.primary,
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: 600,
  },
};