import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../services/api";
import { COLORS } from "../theme/colors";

export default function PatientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const loadPatient = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await api.get(`/api/patients/${id}`);
      const payload = res.data?.data ? res.data.data : res.data;
      setPatient(payload);
    } catch (e) {
      console.log(e);
      setErr("Patient details load ஆகல.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatient();
  }, [id]);

  if (loading) return <p style={{ color: COLORS.gray }}>Loading...</p>;

  if (err) {
    return (
      <div style={styles.errorBox}>
        <div style={{ color: "#be123c", fontWeight: 700 }}>{err}</div>
        <button style={styles.btn} onClick={loadPatient}>Retry</button>
      </div>
    );
  }

  if (!patient) return <p style={{ color: COLORS.gray }}>No data found.</p>;

  const isHigh = String(patient.risk).toLowerCase() === "high";

  return (
    <div>
      <div style={styles.headerRow}>
        <div>
          <h1 style={styles.title}>{patient.name}</h1>
          <p style={styles.subtitle}>Patient ID: {patient.id}</p>
        </div>

        <div style={styles.actions}>
          <button style={styles.secondaryBtn} onClick={() => navigate("/patients")}>
            Back
          </button>
          <button
            style={styles.btn}
            onClick={() => navigate(`/prescriptions?patientId=${encodeURIComponent(patient.id)}`)}
          >
            Prescribe
          </button>
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.infoCard}>
          <div style={styles.label}>Pregnancy Week</div>
          <div style={styles.value}>{patient.week}</div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.label}>Risk Level</div>
          <div
            style={{
              ...styles.badge,
              color: isHigh ? "#be123c" : "#065f46",
              background: isHigh ? "#ffe4e6" : "#d1fae5",
              border: isHigh ? "1px solid #fecdd3" : "1px solid #a7f3d0",
            }}
          >
            {patient.risk}
          </div>
        </div>

        <div style={styles.infoCard}>
          <div style={styles.label}>Risk Score</div>
          <div style={styles.value}>{patient.riskScore}</div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  title: { color: COLORS.primary, marginBottom: 8, fontSize: "30px", fontWeight: 700 },
  subtitle: { color: COLORS.gray, marginTop: 0, fontSize: "15px" },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 20,
  },
  actions: { display: "flex", gap: 8, flexWrap: "wrap" },
  btn: {
    background: COLORS.primary,
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "14px",
  },
  secondaryBtn: {
    background: "#0f172a",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "14px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  infoCard: {
    background: "#fff",
    border: "1px solid #f1dbe6",
    borderRadius: 18,
    padding: 18,
    boxShadow: "0 8px 24px rgba(236,72,153,0.04)",
  },
  label: { color: "#6b7280", fontSize: 13, fontWeight: 600 },
  value: { marginTop: 10, fontSize: 28, fontWeight: 700, color: "#111827" },
  badge: {
    display: "inline-block",
    marginTop: 12,
    padding: "8px 12px",
    borderRadius: 999,
    fontWeight: 600,
    fontSize: 13,
  },
  errorBox: {
    background: "#fff1f2",
    padding: "14px",
    borderRadius: "14px",
    border: "1px solid #fecdd3",
    maxWidth: "540px",
  },
};