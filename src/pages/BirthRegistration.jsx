import { useMemo, useState } from "react";
import { api } from "../services/api";
import { COLORS } from "../theme/colors";

const MOTHER_IDS = ["M001", "M002", "M003", "M004"];

export default function BirthRegistration() {
  const [motherId, setMotherId] = useState("M001");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Female");
  const [weight, setWeight] = useState("");
  const [msg, setMsg] = useState("");
  const [generatedId, setGeneratedId] = useState("");
  const [loading, setLoading] = useState(false);

  const nextMotherId = useMemo(() => {
    const idx = MOTHER_IDS.indexOf(motherId);
    if (idx === -1 || idx === MOTHER_IDS.length - 1) return MOTHER_IDS[0];
    return MOTHER_IDS[idx + 1];
  }, [motherId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setMsg("");
      setGeneratedId("");

      const res = await api.post("/api/birth", {
        motherId,
        dob,
        gender,
        weight,
      });

      setGeneratedId(res.data?.babyId || "");
      setMsg(res.data?.message || "Birth registered successfully ✅");

      setDob("");
      setGender("Female");
      setWeight("");

      // next mother id auto
      setMotherId(nextMotherId);
    } catch (err) {
      setMsg("Birth registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 style={{ color: COLORS.primary }}>Birth Registration</h1>
      <p style={{ color: COLORS.gray }}>Doctor marks delivery and generates a unique Baby ID.</p>

      <form onSubmit={handleSubmit} style={styles.card}>
        <label style={styles.label}>Mother ID</label>
        <select value={motherId} onChange={(e) => setMotherId(e.target.value)} style={styles.input}>
          {MOTHER_IDS.map((id) => (
            <option key={id} value={id}>{id}</option>
          ))}
        </select>

        <label style={styles.label}>Date of Birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={styles.input} required />

        <label style={styles.label}>Gender</label>
        <select value={gender} onChange={(e) => setGender(e.target.value)} style={styles.input}>
          <option>Female</option>
          <option>Male</option>
        </select>

        <label style={styles.label}>Birth Weight (kg) - optional</label>
        <input value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="e.g. 2.8" style={styles.input} />

        <button type="submit" style={styles.btn} disabled={loading}>
          {loading ? "Registering..." : "Register Birth ✅"}
        </button>

        {generatedId ? (
          <div style={styles.successBox}>
            <div><b>Generated Baby ID:</b> {generatedId}</div>
            <div style={{ marginTop: 6 }}><b>Next Mother ID:</b> {nextMotherId}</div>
          </div>
        ) : null}

        {msg ? <div style={{ marginTop: 12, color: "#047857", fontWeight: 700 }}>{msg}</div> : null}
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: "#fff",
    padding: 24,
    borderRadius: 20,
    border: "1px solid #f1d4e4",
    maxWidth: 760,
  },
  label: {
    display: "block",
    fontWeight: 800,
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    width: "100%",
    padding: "14px 16px",
    borderRadius: 14,
    border: "1px solid #ead1df",
    fontSize: 16,
  },
  btn: {
    width: "100%",
    marginTop: 22,
    background: "#ec4899",
    color: "#fff",
    border: "none",
    padding: "14px 16px",
    borderRadius: 14,
    fontWeight: 900,
    cursor: "pointer",
    fontSize: 18,
  },
  successBox: {
    marginTop: 16,
    padding: 14,
    borderRadius: 14,
    background: "#ecfdf5",
    border: "1px solid #a7f3d0",
  },
};