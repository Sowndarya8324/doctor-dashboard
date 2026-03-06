import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { COLORS } from "../theme/colors";

export default function Prescriptions() {
  const [searchParams] = useSearchParams();
  const patientIdFromQuery = searchParams.get("patientId") || "P001";

  const [form, setForm] = useState({
    patientId: patientIdFromQuery,
    medicine: "Paracetamol",
    dosage: "500mg",
    duration: "5 days",
    instructions: "After food, twice a day",
  });

  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setForm((prev) => ({ ...prev, patientId: patientIdFromQuery || "P001" }));
  }, [patientIdFromQuery]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      setLoading(true);
      const res = await api.post("/api/prescriptions", form);

      if (res.data?.success) {
        setStatus("✅ Prescription sent successfully");
      } else {
        setStatus("❌ Failed to send prescription");
      }
    } catch (err) {
      console.log(err);
      setStatus("❌ Backend connect ஆகல or submit failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Prescriptions</h1>
      <p style={styles.subtitle}>Doctor can send medicine details to the patient record.</p>

      <form onSubmit={onSubmit} style={styles.card}>
        <label style={styles.label}>Patient ID</label>
        <input name="patientId" value={form.patientId} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Medicine</label>
        <input name="medicine" value={form.medicine} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Dosage</label>
        <input name="dosage" value={form.dosage} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Duration</label>
        <input name="duration" value={form.duration} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Instructions</label>
        <textarea
          name="instructions"
          value={form.instructions}
          onChange={onChange}
          rows={4}
          style={{ ...styles.input, resize: "vertical" }}
        />

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Sending..." : "Send Prescription ✅"}
        </button>

        {status && <p style={styles.status}>{status}</p>}
      </form>
    </div>
  );
}

const styles = {
  title: { color: COLORS.primary, marginBottom: 8, fontSize: "30px", fontWeight: 700 },
  subtitle: { color: COLORS.gray, marginTop: 0, marginBottom: 20, fontSize: "15px" },
  card: {
    maxWidth: 760,
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    border: "1px solid #f1dbe6",
    boxShadow: "0 8px 24px rgba(236,72,153,0.04)",
  },
  label: {
    display: "block",
    marginTop: 14,
    marginBottom: 6,
    fontWeight: 600,
    color: "#111827",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #ead5df",
    fontSize: 14,
    background: "#fff",
  },
  btn: {
    marginTop: 20,
    width: "100%",
    background: COLORS.primary,
    color: "#fff",
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 600,
    fontSize: "15px",
  },
  status: {
    marginTop: 14,
    color: "#374151",
    fontWeight: 600,
  },
};