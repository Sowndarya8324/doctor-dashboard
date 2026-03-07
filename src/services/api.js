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

const patients = [
  { id: "P001", motherId: "M001", name: "Anitha", week: 28, risk: "High", babyId: "" },
  { id: "P002", motherId: "M002", name: "Lakshmi", week: 32, risk: "Normal", babyId: "" },
  { id: "P003", motherId: "M003", name: "Meena", week: 24, risk: "High", babyId: "" },
  { id: "P004", motherId: "M004", name: "Divya", week: 18, risk: "Normal", babyId: "" },
];

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

let prescriptionsStore = [];
let birthsStore = [];
let vaccinationReminders = [];
let alertsStore = [
  {
    id: "ALT-1",
    type: "risk",
    title: "High Risk Patient",
    message: "Anitha requires closer monitoring this week.",
    createdAt: nowISO(),
  },
];

function ok(data) {
  return Promise.resolve({ data });
}

function getPatientDetail(id) {
  const p = patients.find((x) => x.id === id);
  if (!p) throw new Error("Patient not found");

  const isHigh = p.risk === "High";

  return {
    success: true,
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
        { week: p.week, score: isHigh ? 78 : 55, status: isHigh ? "High" : "Normal" },
      ],
    },
  };
}

function getPatientsList() {
  const enriched = patients.map((p) => {
    const patientPrescriptions = prescriptionsStore.filter((x) => x.patientId === p.id);
    return {
      ...p,
      latestPrescription: patientPrescriptions[0] || null,
      prescriptionsCount: patientPrescriptions.length,
    };
  });

  return {
    success: true,
    data: enriched,
  };
}

function getSummary() {
  return {
    success: true,
    totalPatients: patients.length,
    highRisk: patients.filter((p) => p.risk === "High").length,
    alerts: alertsStore.length,
    prescriptions: prescriptionsStore.length,
  };
}

export const api = {
  async get(url) {
    if (url === "/api/summary") {
      return ok(getSummary());
    }

    if (url === "/api/patients") {
      return ok(getPatientsList());
    }

    if (url.startsWith("/api/patients/")) {
      const id = url.split("/").pop();
      return ok(getPatientDetail(id));
    }

    if (url === "/api/prescriptions") {
      return ok({ success: true, data: prescriptionsStore });
    }

    if (url === "/api/births") {
      return ok({ success: true, data: birthsStore });
    }

    if (url === "/api/vaccinations") {
      return ok({ success: true, data: vaccinationSchedule });
    }

    if (url === "/api/vaccinations/reminders") {
      return ok({ success: true, data: vaccinationReminders });
    }

    if (url === "/api/alerts") {
      return ok({ success: true, data: alertsStore });
    }

    if (url === "/api/admin/analytics") {
      return ok({
        success: true,
        data: {
          totalPatients: patients.length,
          highRisk: patients.filter((p) => p.risk === "High").length,
          prescriptions: prescriptionsStore.length,
          births: birthsStore.length,
          reminders: vaccinationReminders.length,
          alerts: alertsStore.length,
        },
      });
    }

    return ok({ success: true, data: [] });
  },

  async post(url, body = {}) {
    if (url === "/api/prescriptions" || url === "/api/prescription") {
      const { patientId, medicine, dosage, duration, instructions } = body;
      const patient = patients.find((p) => p.id === patientId);

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

      if (patient) {
        alertsStore.unshift({
          id: "ALT-" + Date.now(),
          type: "prescription",
          title: "New Prescription Sent",
          message: `${medicine} prescribed for ${patient.name}`,
          createdAt: nowISO(),
        });
      }

      return ok({
        success: true,
        message: "Prescription sent successfully ✅",
        data: item,
      });
    }

    if (url === "/api/birth") {
      const { motherId, dob, gender, weight } = body;
      const patient = patients.find((p) => p.motherId === motherId);
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

      if (patient) {
        patient.babyId = babyId;
        alertsStore.unshift({
          id: "ALT-" + Date.now(),
          type: "birth",
          title: "Birth Registered",
          message: `${patient.name} assigned baby ID ${babyId}`,
          createdAt: nowISO(),
        });
      }

      return ok({
        success: true,
        message: "Birth registered successfully ✅",
        babyId,
        data: item,
      });
    }

    if (url === "/api/vaccinations/remind") {
      const { patientId, babyId, vaccineId, note } = body;
      const patient = patients.find((p) => p.id === patientId);
      const vaccine = vaccinationSchedule.find((v) => v.id === vaccineId);

      const reminder = {
        id: "VR-" + Date.now(),
        patientId,
        motherId: patient?.motherId || "",
        babyId: babyId || patient?.babyId || "",
        vaccineId,
        vaccine: vaccine?.vaccine || "Unknown",
        when: vaccine?.when || "",
        note: note || "",
        createdAt: nowISO(),
      };

      vaccinationReminders.unshift(reminder);

      alertsStore.unshift({
        id: "ALT-" + Date.now(),
        type: "vaccination",
        title: "Vaccination Reminder Sent",
        message: `${vaccine?.vaccine || "Vaccine"} reminder sent for ${patient?.name || patientId}`,
        createdAt: nowISO(),
      });

      return ok({
        success: true,
        message: "Vaccination reminder sent ✅",
        reminder,
      });
    }

    return ok({ success: true });
  },
};