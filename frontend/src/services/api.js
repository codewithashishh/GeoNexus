const API_URL = "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, options);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export async function processRecord(file) {
  const formData = new FormData();

  if (file) {
    formData.append("document", file);
  }

  return request("/records/process", {
    method: "POST",
    body: formData
  });
}

export async function validateRecord(record, confidence) {
  return request("/records/validate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ record, confidence })
  });
}

export async function saveRecord(record) {
  return request("/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record)
  });
}

export async function getDashboard() {
  return request("/dashboard");
}

export async function getRecords() {
  return request("/records");
}
