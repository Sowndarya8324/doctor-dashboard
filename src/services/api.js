const STORAGE_KEY = "doctor_dashboard_demo_db_v2";

function nowISO() {
  return new Date().toISOString();
}

function generateBabyId() {
  const date = new Date();
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(100000 + Math.random() * 900000);
  return `BABY-${y}${m}${d}-${rand}`;
}

function createDefaultDB() {
  return {
    patients: [
      {
        id: "P001",
        motherId: "M001",
        name: "Anitha",
        week: 28,
        risk: "High",
        babyId: "",
        heartRate: [88, 92, 95, 90, 98, 93, 89],
        kickCount: [12, 10, 14, 9, 11, 13, 8],
      },
      {
        id: "P002",
        motherId: "M002",
        name: "Lakshmi",
        week: 32,
        risk: "Normal",
        babyId: "",
        heartRate: [82, 84, 83, 85, 86, 84, 83],
        kickCount: [9, 10, 9, 11, 10, 9, 10],
      },
      {
        id: "P003",
        motherId: "M003",
        name: "Meena",
        week: 24,
        risk: "High",
        babyId: "",
        heartRate: [91, 94, 93, 96, 97, 95, 94],
        kickCount: [11, 12, 10, 13, 12, 11, 10],
      },
      {
        id: "P004",
        motherId: "M004",
        name: "Divya",
        week: 18,
        risk: "Normal",
        babyId: "",
        heartRate: [80, 81, 82, 80, 83, 82, 81],
        kickCount: [8, 9, 8, 9, 10, 9, 8],
      },
    ],
    prescriptions: [],
    births: [],
    reminders: [],
    alerts: [
      {
        id: "ALT-1",
        type: "risk",
        patientId: "P001",
        title: "High Risk Patient",
        message: "Anitha requires closer monitoring this week.",
        createdAt: nowISO(),
      },
    ],
    vaccinations: [
      { id: "V001", vaccine: "BCG", when: "At birth (0 day)" },
      { id: "V002", vaccine: "OPV-0", when: "At birth (0 day)" },
      { id: "V003", vaccine: "HepB-0", when: "Within 24 hours" },
      { id: "V004", vaccine: "DPT-1", when: "6 weeks" },
      { id: "V005", vaccine: "OPV-1", when: "6 weeks" },
      { id: "V006", vaccine: "DPT-2", when: "10 weeks" },
      { id: "V007", vaccine: "DPT-3", when: "14 weeks" },
      { id: "V008", vaccine: "MR-1", when: "9 months" },
    ],
  };
}

function readDB() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const fresh = createDefaultDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
  try {
    return JSON.parse(raw);
  } catch {
    const fresh = createDefaultDB();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
    return fresh;
  }
}

function writeDB(db) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
}

function ok(data) {
  return Promise.resolve({ data });
}

function withCounts(patient, db) {
  const patientPrescriptions = db.prescriptions.filter((x) => x.patientId === patient.id);
  return {
    ...patient,
    latestPrescription: patientPrescriptions[0] || null,
    prescriptionsCount: patientPrescriptions.length,
  };
}

function buildPatientDetail(patient) {
  const hr = patient.heartRate || [];
  const kc = patient.kickCount || [];

  const dayChanges = hr.map((value, index) => {
    if (index === 0) return 0;
    return value - hr[index - 1];
  });

  const kickChanges = kc.map((value, index) => {
    if (index === 0) return 0;
    return value - kc[index - 1];
  });

  const isHigh = patient.risk === "High";

  return {
    success: true,
    data: {
      id: patient.id,
      motherId: patient.motherId,
      babyId: patient.babyId || "",
      name: patient.name,
      week: patient.week,
      risk: patient.risk,
      riskScore: isHigh ? 78 : 45,
      heartRate: hr,
      kickCount: kc,
      heartRateDayChanges: dayChanges,
      kickCountDayChanges: kickChanges,
      assessments: [
        { week: patient.week - 2, score: isHigh ? 68 : 54, status: "Normal" },
        { week: patient.week - 1, score: isHigh ? 74 : 57, status: isHigh ? "Medium" : "Normal" },
        { week: patient.week, score: isHigh ? 78 : 55, status: isHigh ? "High" : "Normal" },
      ],
    },
  };
}

export const api = {
  async get(url) {
    const db = readDB();

    if (url === "/api/summary") {
      return ok({
        success: true,
        totalPatients: db.patients.length,
        highRisk: db.patients.filter((p) => p.risk === "High").length,
        alerts: db.alerts.length,
        prescriptions: db.prescriptions.length,
      });
    }

    if (url === "/api/patients") {
      return ok({
        success: true,
        data: db.patients.map((p) => withCounts(p, db)),
      });
    }

    if (url.startsWith("/api/patients/")) {
      const id = url.split("/").pop();
      const patient = db.patients.find((p) => p.id === id);
      if (!patient) {
        return ok({ success: false, message: "Patient not found", data: null });
      }
      return ok(buildPatientDetail(patient));
    }

    if (url === "/api/prescriptions") {
      return ok({ success: true, data: db.prescriptions });
    }

    if (url === "/api/births") {
      return ok({ success: true, data: db.births });
    }

    if (url === "/api/vaccinations") {
      return ok({ success: true, data: db.vaccinations });
    }

    if (url === "/api/vaccinations/reminders") {
      return ok({ success: true, data: db.reminders });
    }

    if (url === "/api/alerts") {
      return ok({ success: true, data: db.alerts });
    }

    return ok({ success: true, data: [] });
  },

  async post(url, body = {}) {
    const db = readDB();

    if (url === "/api/prescriptions" || url === "/api/prescription") {
      const { patientId, medicine, dosage, duration, instructions } = body;
      const patient = db.patients.find((p) => p.id === patientId);

      const item = {
        id: "RX-" + Date.now(),
        patientId,
        medicine,
        dosage,
        duration: duration || "",
        instructions: instructions || "",
        createdAt: nowISO(),
      };

      db.prescriptions.unshift(item);

      if (patient) {
        db.alerts.unshift({
          id: "ALT-" + Date.now(),
          type: "prescription",
          patientId,
          title: "Prescription Sent",
          message: `${medicine} prescribed for ${patient.name}`,
          createdAt: nowISO(),
        });
      }

      writeDB(db);

      return ok({
        success: true,
        message: "Prescription sent successfully ✅",
        data: item,
      });
    }

    if (url === "/api/birth") {
      const { motherId, dob, gender, weight } = body;
      const patient = db.patients.find((p) => p.motherId === motherId);

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

      db.births.unshift(item);

      if (patient) {
        patient.babyId = babyId;

        db.alerts.unshift({
          id: "ALT-" + Date.now(),
          type: "birth",
          patientId: patient.id,
          title: "Birth Registered",
          message: `${patient.name} assigned baby ID ${babyId}`,
          createdAt: nowISO(),
        });
      }

      writeDB(db);

      return ok({
        success: true,
        message: "Birth registered successfully ✅",
        babyId,
        data: item,
      });
    }

    if (url === "/api/vaccinations/remind") {
      const { patientId, babyId, vaccineId, note } = body;
      const patient = db.patients.find((p) => p.id === patientId);
      const vaccine = db.vaccinations.find((v) => v.id === vaccineId);

      const reminder = {
        id: "VR-" + Date.now(),
        patientId,
        motherId: patient?.motherId || "",
        babyId: babyId || patient?.babyId || "",
        vaccineId,
        vaccine: vaccine?.vaccine || "",
        when: vaccine?.when || "",
        note: note || "",
        createdAt: nowISO(),
      };

      db.reminders.unshift(reminder);

      db.alerts.unshift({
        id: "ALT-" + Date.now(),
        type: "vaccination",
        patientId,
        title: "Vaccination Reminder Sent",
        message: `${vaccine?.vaccine || "Vaccine"} reminder sent for ${patient?.name || patientId}`,
        createdAt: nowISO(),
      });

      writeDB(db);

      return ok({
        success: true,
        message: "Vaccination reminder sent successfully ✅",
        reminder,
      });
    }

    return ok({ success: true });
  },
};