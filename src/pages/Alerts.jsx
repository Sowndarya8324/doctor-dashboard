import { useEffect, useState } from "react";
import { api } from "../services/api";
import { COLORS } from "../theme/colors";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    const res = await api.get("/api/alerts");
    setAlerts(res.data?.data || []);
  };

  return (
    <div>
      <h1 style={{ color: COLORS.primary }}>Alerts</h1>
      <p style={{ color: COLORS.gray }}>Recent notifications, reminders and updates.</p>

      <div style={{ marginTop: 20 }}>
        {alerts.length === 0 ? (
          <div style={styles.card}>No alerts yet.</div>
        ) : (
          alerts.map((a) => (
            <div key={a.id} style={styles.card}>
              <div style={{ fontWeight: 900, fontSize: 18 }}>{a.title}</div>
              <div style={{ marginTop: 8, color: COLORS.gray }}>{a.message}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: 16,
    borderRadius: 16,
    border: "1px solid #f1d4e4",
    marginBottom: 14,
  },
};