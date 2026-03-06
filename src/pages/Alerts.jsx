import { useEffect, useState } from "react";
import { COLORS } from "../theme/colors";
import { api } from "../services/api";

export default function Alerts() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadAlerts = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await api.get("/api/debug/mother-notifications");
      const payload = Array.isArray(res.data?.data) ? res.data.data : [];
      setRows(payload);
    } catch (e) {
      console.log(e);
      setErr("Alerts load ஆகல. Backend running இருக்கா check பண்ணு.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  return (
    <div>
      <h1 style={styles.title}>Alerts</h1>
      <p style={styles.subtitle}>Recent notifications, reminders and updates.</p>

      {loading && <p style={{ color: COLORS.gray }}>Loading...</p>}

      {!loading && err && (
        <div style={styles.errorBox}>
          <p style={{ margin: 0, color: "#be123c" }}>{err}</p>
          <button style={styles.btn} onClick={loadAlerts}>Retry</button>
        </div>
      )}

      {!loading && !err && (
        <div style={styles.card}>
          {rows.length === 0 ? (
            <p style={{ color: COLORS.gray, margin: 0 }}>No alerts found.</p>
          ) : (
            <div style={styles.list}>
              {rows.map((item) => (
                <div key={item.id} style={styles.alertItem}>
                  <div style={styles.alertTitle}>{item.title || "Notification"}</div>
                  <div style={styles.alertMsg}>{item.message}</div>
                  <div style={styles.meta}>
                    Mother ID: {item.motherId || "—"} | Patient ID: {item.patientId || "—"} | Baby ID: {item.babyId || "—"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { color: COLORS.primary, marginBottom: 8, fontSize: "30px", fontWeight: 700 },
  subtitle: { color: COLORS.gray, marginTop: 0, marginBottom: 20, fontSize: "15px" },
  card: {
    background: "#fff",
    border: "1px solid #f1dbe6",
    borderRadius: 18,
    padding: 20,
    boxShadow: "0 8px 24px rgba(236,72,153,0.04)",
  },
  list: { display: "grid", gap: 12 },
  alertItem: {
    border: "1px solid #f1dbe6",
    borderRadius: 14,
    padding: 14,
    background: "#fffafc",
  },
  alertTitle: { fontWeight: 700, color: "#111827", marginBottom: 6 },
  alertMsg: { color: "#475569", fontSize: "14px", marginBottom: 6 },
  meta: { color: "#94a3b8", fontSize: "12px" },
  errorBox: {
    background: "#fff1f2",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #fecdd3",
    maxWidth: "540px",
  },
  btn: {
    marginTop: 10,
    background: COLORS.primary,
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 10,
    fontWeight: 600,
  },
};