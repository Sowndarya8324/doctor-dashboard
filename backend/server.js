const express = require("express");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "2mb" }));

function generateBabyId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `BABY-${y}${m}${d}-${rand}`;
}

function nowISO() {
  return new Date().toISOString();
}

function ok(res, payload) {
  return res.json({ success: true, ...payload });
}

function bad(res, message, status = 400) {
  return res.status(status).json({ success: false, message });
}

app.get("/", (req, res) => {
  res.send("Backend Running ✅");
});

const patients = [
  { id: "P001", motherId: "M001", name: "Anitha", week: 28, risk: "High", babyId: "" },
  { id: "P002", motherId: "M002", name: "Lakshmi", week: 32, risk: "Normal", babyId: "" },
  { id: "P003", motherId: "M003", name: "Meena", week: 24, risk: "High", babyId: "" },
  { id: "P004", motherId: "M004", name: "Divya", week: 18, risk: "Normal", babyId: "" },
];

let prescriptionsStore = [];
let birthsStore = [];
let vaccinationReminders = [];
let motherNotifications = [];

const vaccinationSchedule = [
  { id: "V001", vaccine: "BCG", when: "At birth (0 day)" },
  { id: "V002", vaccine: "OPV-0", when: "At birth (0 day)" },
  { id: "V003", vaccine: "HepB-0", when: "Within 24 hours" },
  { id: "V004", vaccine: "DPT-1", when: "6 weeks" },
  { id: "V005", vaccine: "OPV-1", when: "6 weeks" },
  { id: "V006", vaccine: "DPT-2", when: "10 weeks" },
  { id: "V007", vaccine: "DPT-3", when: "14 weeks" },
  { id: "V008", vaccine: "MR-1", when: "9 months" },
];

app.get("/api/summary", (req, res) => {
  const totalPatients = patients.length;
  const highRisk = patients.filter((p) => p.risk === "High").length;
  const alerts = motherNotifications.length;
  const prescriptions = prescriptionsStore.length;

  return ok(res, {
    totalPatients,
    highRisk,
    alerts,
    prescriptions,
  });
});

app.get("/api/patients", (req, res) => {
  const enriched = patients.map((p) => {
    const patientPrescriptions = prescriptionsStore.filter((x) => x.patientId === p.id);
    return {
      ...p,
      latestPrescription: patientPrescriptions[0] || null,
      prescriptionsCount: patientPrescriptions.length,
    };
  });

  return ok(res, { data: enriched });
});

app.get("/api/patients/:id", (req, res) => {
  const { id } = req.params;
  const p = patients.find((x) => x.id === id);

  if (!p) return bad(res, `Patient not found: ${id}`, 404);

  const isHigh = p.risk === "High";

  return ok(res, {
    data: {
      id: p.id,
      motherId: p.motherId,
      babyId: p.babyId || "",
      name: p.name,
      week: p.week,
      risk: p.risk,
      riskScore: isHigh ? 78 : 45,
      heartRate: [88, 92, 95, 90, 98, 93, 89],
      kickCount: [12, 10, 14, 9, 11, 13, 8],
      assessments: [
        { week: 26, score: 62, status: "Normal" },
        { week: 27, score: 71, status: "Medium" },
        { week: 28, score: isHigh ? 78 : 55, status: isHigh ? "High" : "Normal" },
      ],
    },
  });
});

function handlePrescription(req, res) {
  const { patientId, medicine, dosage, duration, instructions } = req.body || {};

  if (!patientId || !medicine || !dosage) {
    return bad(res, "Missing fields: patientId, medicine, dosage required");
  }

  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return bad(res, `Invalid patientId: ${patientId}`, 404);

  const item = {
    id: "RX-" + Date.now(),
    patientId,
    medicine,
    dosage,
    duration: duration || "",
    instructions: instructions || "",
    createdAt: nowISO(),
  };

  prescriptionsStore.unshift(item);

  motherNotifications.unshift({
    id: "NTF-" + Date.now(),
    motherId: patient.motherId,
    patientId,
    type: "prescription",
    title: "New Prescription",
    message: `${medicine} prescribed for ${duration || "treatment"}`,
    isRead: false,
    createdAt: nowISO(),
  });

  return ok(res, {
    message: "Prescription sent successfully ✅",
    data: item,
  });
}

app.post("/api/prescriptions", handlePrescription);
app.post("/api/prescription", handlePrescription);

app.get("/api/prescriptions", (req, res) => {
  return ok(res, { data: prescriptionsStore });
});

app.post("/api/birth", (req, res) => {
  const { motherId, dob, gender, weight } = req.body || {};

  if (!motherId || !dob || !gender) {
    return bad(res, "Missing fields: motherId, dob, gender required");
  }

  const patient = patients.find((p) => p.motherId === motherId);
  if (!patient) return bad(res, `Invalid motherId: ${motherId}`, 404);

  const babyId = generateBabyId();

  const item = {
    id: "BR-" + Date.now(),
    motherId,
    babyId,
    dob,
    gender,
    weight: weight || "",
    createdAt: nowISO(),
  };

  birthsStore.unshift(item);
  patient.babyId = babyId;

  motherNotifications.unshift({
    id: "NTF-" + Date.now(),
    motherId,
    patientId: patient.id,
    babyId,
    type: "birth",
    title: "Birth Registered",
    message: `Baby ID generated: ${babyId}`,
    isRead: false,
    createdAt: nowISO(),
  });

  return ok(res, {
    message: "Birth registered successfully ✅",
    babyId,
    data: item,
  });
});

app.get("/api/births", (req, res) => {
  return ok(res, { data: birthsStore });
});

app.get("/api/vaccinations", (req, res) => {
  return ok(res, { data: vaccinationSchedule });
});

app.post("/api/vaccinations/remind", (req, res) => {
  const { patientId, babyId, vaccineId, note } = req.body || {};

  if (!patientId || !vaccineId) {
    return bad(res, "patientId and vaccineId required");
  }

  const patient = patients.find((p) => p.id === patientId);
  if (!patient) return bad(res, `Invalid patientId: ${patientId}`, 404);

  const v = vaccinationSchedule.find((x) => x.id === vaccineId);
  if (!v) return bad(res, `Invalid vaccineId: ${vaccineId}`, 404);

  const reminder = {
    id: "VR-" + Date.now(),
    patientId,
    motherId: patient.motherId,
    babyId: babyId || patient.babyId || "",
    vaccineId,
    vaccine: v.vaccine,
    when: v.when,
    note: note || "",
    createdAt: nowISO(),
  };

  vaccinationReminders.unshift(reminder);

  motherNotifications.unshift({
    id: "NTF-" + Date.now(),
    motherId: patient.motherId,
    patientId,
    babyId: reminder.babyId,
    type: "vaccination",
    title: "Vaccination Reminder",
    message: `${v.vaccine} due ${v.when}. ${note || ""}`.trim(),
    isRead: false,
    createdAt: nowISO(),
  });

  return ok(res, {
    message: "Vaccination reminder sent ✅",
    reminder,
  });
});

app.get("/api/vaccinations/reminders", (req, res) => {
  return ok(res, { data: vaccinationReminders });
});

app.get("/api/alerts", (req, res) => {
  return ok(res, { data: motherNotifications });
});

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});