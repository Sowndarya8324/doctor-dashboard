import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../services/api";
import { COLORS } from "../theme/colors";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

export default function PatientDetail() {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    loadPatient();
  }, [id]);

  const loadPatient = async () => {
    const res = await api.get(`/api/patients/${id}`);
    setPatient(res.data?.data || null);
  };

  if (!patient) return <p>Loading...</p>;

  const labels = ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5", "Day 6", "Day 7"];

  const heartRateData = {
    labels,
    datasets: [
      {
        label: "Heart Rate",
        data: patient.heartRate,
        borderColor: "#ec4899",
        backgroundColor: "#fce7f3",
      },
    ],
  };

  const kickData = {
    labels,
    datasets: [
      {
        label: "Kick Count",
        data: patient.kickCount,
        borderColor: "#8b5cf6",
        backgroundColor: "#ede9fe",
      },
    ],
  };

  return (
    <div>
      <h1 style={{ color: COLORS.primary }}>{patient.name}</h1>
      <p>Mother ID: <b>{patient.motherId}</b></p>
      <p>Baby ID: <b>{patient.babyId || "Not generated"}</b></p>
      <p>Pregnancy Week: <b>{patient.week}</b></p>
      <p>
        Risk Level:{" "}
        <b style={{ color: patient.risk === "High" ? "#dc2626" : "#059669" }}>
          {patient.risk}
        </b>
      </p>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Heart Rate Graph</h3>
          <Line data={heartRateData} />
        </div>

        <div style={styles.card}>
          <h3>Kick Counter Graph</h3>
          <Line data={kickData} />
        </div>
      </div>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3>Heart Rate Day Change</h3>
          <ul>
            {patient.heartRateDayChanges.map((v, i) => (
              <li key={i}>
                Day {i + 1}: {v > 0 ? `+${v}` : v}
              </li>
            ))}
          </ul>
        </div>

        <div style={styles.card}>
          <h3>Kick Count Day Change</h3>
          <ul>
            {patient.kickCountDayChanges.map((v, i) => (
              <li key={i}>
                Day {i + 1}: {v > 0 ? `+${v}` : v}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const styles = {
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 18,
    marginTop: 20,
  },
  card: {
    background: "#fff",
    padding: 18,
    borderRadius: 18,
    border: "1px solid #f1d4e4",
  },
};