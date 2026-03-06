import { useEffect, useState } from "react";
import { COLORS } from "../theme/colors";
import { api } from "../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function AdminAnalytics() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await api.get("/api/admin/analytics");
      const payload = res.data?.data ? res.data.data : res.data;
      setData(payload);
    } catch (e) {
      console.log(e);
      setErr("Admin analytics load ஆகல.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const chartData = {
    labels: data?.prescriptionsByPatient?.map((p) => p.name) || [],
    datasets: [
      {
        label: "Prescriptions",
        data: data?.prescriptionsByPatient?.map((p) => p.count) || [],
        backgroundColor: "#ec4899",
        borderRadius: 8,
      },
    ],
  };

  return (
    <div>
      <h1 style={styles.title}>Admin Analytics Panel</h1>
      <p style={styles.subtitle}>
        Overall system analytics, prescriptions, births and alerts.
      </p>

      {loading && <p style={{ color: COLORS.gray }}>Loading...</p>}

      {!loading && err && (
        <div style={styles.errorBox}>
          <p style={{ margin: 0, color: "#be123c" }}>{err}</p>
          <button style={styles.primaryBtn} onClick={loadAnalytics}>
            Retry
          </button>
        </div>
      )}

      {!loading && !err && data && (
        <>
          <div style={styles.grid}>
            <div style={styles.card}><div style={styles.label}>Total Patients</div><div style={styles.value}>{data.totalPatients}</div></div>
            <div style={styles.card}><div style={styles.label}>High Risk</div><div style={styles.value}>{data.highRiskPatients}</div></div>
            <div style={styles.card}><div style={styles.label}>Births</div><div style={styles.value}>{data.totalBirths}</div></div>
            <div style={styles.card}><div style={styles.label}>Unread Alerts</div><div style={styles.value}>{data.unreadAlerts}</div></div>
          </div>

          <div style={styles.chartCard}>
            <h2 style={styles.chartTitle}>Prescriptions by Patient</h2>
            <Bar data={chartData} />
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  title: {
    color: COLORS.primary,
    marginBottom: 8,
    fontSize: "30px",
    fontWeight: 700,
  },
  subtitle: {
    color: COLORS.gray,
    marginTop: 0,
    marginBottom: 22,
    fontSize: "15px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
    marginBottom: 20,
  },
  card: {
    background: "#fff",
    border: "1px solid #f1dbe6",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 8px 24px rgba(236,72,153,0.04)",
  },
  label: {
    color: "#6b7280",
    fontSize: 13,
    fontWeight: 600,
  },
  value: {
    marginTop: 10,
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
  },
  chartCard: {
    background: "#fff",
    border: "1px solid #f1dbe6",
    borderRadius: 18,
    padding: 22,
    boxShadow: "0 8px 24px rgba(236,72,153,0.04)",
  },
  chartTitle: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 16,
    color: "#111827",
  },
  errorBox: {
    background: "#fff1f2",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #fecdd3",
    maxWidth: "540px",
  },
  primaryBtn: {
    marginTop: "10px",
    background: COLORS.primary,
    color: "#fff",
    padding: "10px 14px",
    borderRadius: "10px",
    fontWeight: 600,
  },
};