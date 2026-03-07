export const api = {
  async get(url) {

    if (url === "/api/summary") {
      return {
        data: {
          success: true,
          totalPatients: 4,
          highRisk: 2,
          alerts: 1,
          prescriptions: 1
        }
      }
    }

    if (url === "/api/patients") {
      return {
        data: {
          success: true,
          data: [
            { id: "P001", name: "Anitha", week: 28, risk: "High" },
            { id: "P002", name: "Lakshmi", week: 32, risk: "Normal" },
            { id: "P003", name: "Meena", week: 24, risk: "High" },
            { id: "P004", name: "Divya", week: 18, risk: "Normal" }
          ]
        }
      }
    }

    if (url === "/api/alerts") {
      return {
        data: {
          success: true,
          data: [
            {
              title: "High Risk Patient",
              message: "Anitha requires monitoring"
            }
          ]
        }
      }
    }

    return { data: { success: true, data: [] } }

  },

  async post() {
    return {
      data: {
        success: true,
        message: "Saved successfully"
      }
    }
  }
}