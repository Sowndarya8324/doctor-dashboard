import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "../services/api";
import { COLORS } from "../theme/colors";

const patientToMother = {
  P001: "M001",
  P002: "M002",
  P003: "M003",
  P004: "M004",
};

export default function Patients() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const riskFilter = searchParams.get("risk");

  const load = async () => {
    try {
      setLoading(true);
      setErr("");

      const res = await api.get("/api/patients");
      const payload = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      const enriched = payload.map((p) => ({
        ...p,
        motherId: patientToMother[p.id] || "",
      }));

      setRows(enriched);
    } catch (e) {
      console.log(e);
      setErr("Patients load ஆகல. Backend running இருக்கா check பண்ணு.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filteredRows = useMemo(() => {
    let list = [...rows];

    if (riskFilter) {
      list = list.filter(
        (p) => String(p.risk).toLowerCase() === String(riskFilter).toLowerCase()
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          String(p.name || "").toLowerCase().includes(q) ||
          String(p.id || "").toLowerCase().includes(q) ||
          String(p.motherId || "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [rows, search, riskFilter]);

  const openPatient = (patientId) => navigate(`/patients/${patientId}`);

  const goPrescription = (patientId, motherId, babyId) => {
    navigate(
      `/prescriptions?patientId=${encodeURIComponent(
        patientId
      )}&motherId=${encodeURIComponent(motherId || "")}&babyId=${encodeURIComponent(
        babyId || ""
      )}`
    );
  };

  const goVaccination = (patientId, motherId, babyId) => {
    navigate(
      `/vaccination-reminders?patientId=${encodeURIComponent(
        patientId
      )}&motherId=${encodeURIComponent(motherId || "")}&babyId=${encodeURIComponent(
        babyId || ""
      )}`
    );
  };

  return (
    <div>
      <h1 style={styles.title}>Patient List</h1>
      <p style={styles.subtitle}>
        High risk patients are highlighted. Click any row to open patient details.
      </p>

      <div style={styles.topBar}>
        <input
          type="text"
          placeholder="Search by patient name, ID or Mother ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />

        <div style={styles.topActions}>
          <button
            style={{
              ...styles.filterBtn,
              background: !riskFilter ? "#ec4899" : "#fff1f6",
              color: !riskFilter ? "#ffffff" : "#be185d",
              border: !riskFilter ? "1px solid #ec4899" : "1px solid #f9a8d4",
            }}
            onClick={() => navigate("/patients")}
          >
            All
          </button>

          <button
            style={{
              ...styles.filterBtn,
              background: riskFilter === "High" ? "#ec4899" : "#fff1f6",
              color: riskFilter === "High" ? "#ffffff" : "#be185d",
              border:
                riskFilter === "High"
                  ? "1px solid #ec4899"
                  : "1px solid #f9a8d4",
            }}
            onClick={() => navigate("/patients?risk=High")}
          >
            High Risk
          </button>

          <button style={styles.refreshBtn} onClick={load}>
            Refresh
          </button>
        </div>
      </div>

      {loading && <p style={{ color: COLORS.gray }}>Loading...</p>}

      {!loading && err && (
        <div style={styles.errorBox}>
          <div style={{ color: "#be123c", fontWeight: 700 }}>{err}</div>
          <button style={styles.btn} onClick={load}>Retry</button>
        </div>
      )}

      {!loading && !err && (
        <div style={styles.card}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Mother ID</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Week</th>
                <th style={styles.th}>Risk</th>
                <th style={styles.th}>Action</th>
              </tr>
            </thead>

            <tbody>
              {filteredRows.map((p) => {
                const isHigh = String(p.risk).toLowerCase() === "high";

                return (
                  <tr
                    key={p.id}
                    style={{
                      background: isHigh ? "#fff4f6" : "#ffffff",
                      borderBottom: "1px solid #f3e8ef",
                      cursor: "pointer",
                    }}
                    onClick={() => openPatient(p.id)}
                  >
                    <td style={styles.td}>{p.id}</td>
                    <td style={styles.td}>{p.motherId}</td>
                    <td style={{ ...styles.td, fontWeight: 700 }}>{p.name}</td>
                    <td style={styles.td}>{p.week}</td>
                    <td style={styles.td}>
                      <span
                        style={{
                          padding: "7px 14px",
                          borderRadius: 999,
                          fontWeight: 600,
                          fontSize: 13,
                          color: isHigh ? "#be123c" : "#065f46",
                          background: isHigh ? "#ffe4e6" : "#d1fae5",
                          border: isHigh
                            ? "1px solid #fecdd3"
                            : "1px solid #a7f3d0",
                        }}
                      >
                        {p.risk}
                      </span>
                    </td>
                    <td style={styles.td}>
  {p.latestPrescription ? (
    <div>
      <div style={{ fontWeight: 700 }}>{p.latestPrescription.medicine}</div>
      <div style={{ fontSize: 12, color: COLORS.gray }}>
        {p.latestPrescription.dosage}
      </div>
    </div>
  ) : (
    <span style={{ color: COLORS.gray }}>—</span>
  )}
</td>

<td style={styles.td}>{p.prescriptionsCount ?? 0}</td>
                    <td style={styles.td}>
                      <div style={styles.actionWrap} onClick={(e) => e.stopPropagation()}>
                        <button
                          style={styles.presBtn}
                          onClick={() => goPrescription(p.id, p.motherId, p.babyId)}
                        >
                          Prescribe
                        </button>

                        <button
                          style={styles.vaccineBtn}
                          onClick={() => goVaccination(p.id, p.motherId, p.babyId)}
                        >
                          Vaccine
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  title: { color: COLORS.primary, marginBottom: 8, fontSize: "30px", fontWeight: 700 },
  subtitle: { color: COLORS.gray, marginTop: 0, marginBottom: 20, fontSize: "15px" },
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    marginBottom: 18,
  },
  searchInput: {
    minWidth: 280,
    flex: 1,
    maxWidth: 550,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #ead5df",
    fontSize: 14,
    background: "#fff",
  },
  topActions: { display: "flex", gap: 8, flexWrap: "wrap" },
  filterBtn: { padding: "10px 14px", borderRadius: 12, fontWeight: 600, fontSize: "14px" },
  refreshBtn: {
    background: "#0f172a",
    color: "#fff",
    padding: "10px 14px",
    borderRadius: 12,
    fontWeight: 600,
  },
  card: {
    background: "#fff",
    border: "1px solid #f1dbe6",
    borderRadius: 18,
    boxShadow: "0 8px 24px rgba(236,72,153,0.04)",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: 14, fontSize: 13, color: "#6b7280", background: "#fff8fb" },
  td: { padding: 16, fontSize: 14, color: "#111827" },
  actionWrap: { display: "flex", gap: 8, flexWrap: "wrap" },
  presBtn: {
    background: "#ec4899",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "14px",
  },
  vaccineBtn: {
    background: "#8b5cf6",
    color: "#fff",
    padding: "8px 14px",
    borderRadius: 12,
    fontWeight: 600,
    fontSize: "14px",
  },
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