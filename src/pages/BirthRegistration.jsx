import { useState } from "react";
import { COLORS } from "../theme/colors";
import { api } from "../services/api";

export default function BirthRegistration() {
  const [form, setForm] = useState({
    motherId: "M001",
    dob: "",
    gender: "Female",
    weight: "",
  });

  const [status, setStatus] = useState("");
  const [generatedBabyId, setGeneratedBabyId] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus("");
    setGeneratedBabyId("");

    try {
      const res = await api.post("/api/birth", form);

      if (res.data?.success) {
        const babyId = res.data?.babyId || "";
        setGeneratedBabyId(babyId);
        setStatus("✅ Birth registered successfully");

        if (babyId) {
          localStorage.setItem("latestBabyId", babyId);
          localStorage.setItem("latestMotherId", form.motherId);
        }
      } else {
        setStatus("❌ Failed to register birth");
      }
    } catch (err) {
      console.log(err);
      setStatus("❌ Backend connect ஆகல");
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Birth Registration</h1>
      <p style={styles.subtitle}>Doctor marks delivery and generates a unique Baby ID.</p>

      <form onSubmit={onSubmit} style={styles.card}>
        <h2 style={styles.formTitle}>Register New Birth</h2>

        <label style={styles.label}>Mother ID</label>
        <input name="motherId" value={form.motherId} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Date of Birth</label>
        <input type="date" name="dob" value={form.dob} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Gender</label>
        <select name="gender" value={form.gender} onChange={onChange} style={styles.input}>
          <option value="Female">Female</option>
          <option value="Male">Male</option>
        </select>

        <label style={styles.label}>Birth Weight (kg) - optional</label>
        <input
          name="weight"
          value={form.weight}
          onChange={onChange}
          style={styles.input}
          placeholder="e.g. 2.8"
        />

        <button type="submit" style={styles.btn}>Register Birth ✅</button>

        {status && <p style={styles.status}>{status}</p>}

        {generatedBabyId && (
          <div style={styles.successBox}>
            <div style={styles.successTitle}>Generated Baby ID</div>
            <div style={styles.babyId}>{generatedBabyId}</div>
          </div>
        )}
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
  formTitle: { fontSize: 22, fontWeight: 700, marginBottom: 20, color: "#111827" },
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
  status: { marginTop: 14, color: "#374151", fontWeight: 600 },
  successBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 14,
    background: "#fdf2f8",
    border: "1px solid #f9a8d4",
  },
  successTitle: { fontSize: 13, color: "#9d174d", fontWeight: 700 },
  babyId: { marginTop: 8, fontSize: 22, fontWeight: 700, color: "#be185d" },
};