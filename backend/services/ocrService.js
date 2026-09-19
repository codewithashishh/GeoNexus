export function runDemoOCR(file) {
  // Prototype-only OCR simulation.
  // Replace this service with a real OCR provider/engine later.
  return {
    rawText: `
Owner Name: Ramesh Kumar
Khata Number: 1245
Plot Number: 367/2
Area: 0.42 Acre
Village: Baripada
District: Mayurbhanj
State: Odisha
    `.trim(),
    source: file ? `Uploaded: ${file.originalname}` : "Sample Demo Record"
  };
}

export function extractFields(_rawText) {
  return {
    ownerName: "Ramesh Kumar",
    khataNumber: "1245",
    plotNumber: "367/2",
    area: "0.42 Acre",
    village: "Baripada",
    district: "Mayurbhanj",
    state: "Odisha"
  };
}

export function scoreConfidence() {
  return {
    ownerName: 96,
    khataNumber: 98,
    plotNumber: 94,
    area: 68,
    village: 93,
    district: 54,
    state: 97
  };
}
