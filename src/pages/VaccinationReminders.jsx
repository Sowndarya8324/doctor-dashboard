import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { COLORS } from "../theme/colors";
import { api } from "../services/api";

export default function VaccinationReminders() {
  const [searchParams] = useSearchParams();

  const [schedule, setSchedule] = useState([]);
  const [status, setStatus] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    motherId: "",
    babyId: "",
    vaccineId: "V004",
    note: "Please visit hospital this week",
  });

  useEffect(() => {
    const qPatientId = searchParams.get("patientId") || "";
    const qMotherId = searchParams.get("motherId") || "";
    const qBabyId = searchParams.get("babyId") || "";
    const savedBabyId = localStorage.getItem("latestBabyId") || "";
    const savedMotherId = localStorage.getItem("latestMotherId") || "";

    setForm((prev) => ({
      ...prev,
      patientId: qPatientId || prev.patientId || "P001",
      motherId: qMotherId || savedMotherId || "",
      babyId: qBabyId || savedBabyId || "",
    }));
  }, [searchParams]);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/api/vaccinations");
        const payload = Array.isArray(res.data?.data) ? res.data.data : [];
        setSchedule(payload);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendReminder = async (e) => {
    e.preventDefault();
    setStatus("");

    try {
      const res = await api.post("/api/vaccinations/remind", {
        patientId: form.patientId,
        babyId: form.babyId,
        vaccineId: form.vaccineId,
        note: form.note,
      });

      if (res.data?.success) {
        setStatus("✅ Vaccination reminder sent successfully");
      } else {
        setStatus("❌ Failed");
      }
    } catch (err) {
      console.log(err);
      setStatus("❌ Backend connect ஆகல");
    }
  };

  return (
    <div>
      <h1 style={styles.title}>Vaccination Reminder</h1>
      <p style={styles.subtitle}>Doctor sends vaccination due reminder to mother dashboard.</p>

      <form onSubmit={sendReminder} style={styles.card}>
        <label style={styles.label}>Patient ID</label>
        <input name="patientId" value={form.patientId} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Mother ID</label>
        <input name="motherId" value={form.motherId} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Baby ID</label>
        <input name="babyId" value={form.babyId} onChange={onChange} style={styles.input} />

        <label style={styles.label}>Vaccine</label>
        <select name="vaccineId" value={form.vaccineId} onChange={onChange} style={styles.input}>
          {schedule.map((v) => (
            <option key={v.id} value={v.id}>
              {v.vaccine} — {v.when}
            </option>
          ))}
        </select>

        <label style={styles.label}>Note</label>
        <textarea
          name="note"
          value={form.note}
          onChange={onChange}
          rows={4}
          style={{ ...styles.input, resize: "vertical" }}
        />

        <button type="submit" style={styles.btn}>Send Reminder ✅</button>

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
  status: { marginTop: 14, color: "#374151", fontWeight: 600 },
};