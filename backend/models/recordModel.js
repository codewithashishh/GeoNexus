let records = [
  {
    id: 1,
    ownerName: "Ramesh Kumar",
    khataNumber: "1245",
    plotNumber: "367/2",
    area: "0.42 Acre",
    village: "Baripada",
    district: "Mayurbhanj",
    state: "Odisha",
    status: "Verified",
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    ownerName: "Sunita Das",
    khataNumber: "2891",
    plotNumber: "118",
    area: "0.31 Acre",
    village: "Balasore",
    district: "Balasore",
    state: "Odisha",
    status: "Needs Review",
    createdAt: new Date(Date.now() - 86400000).toISOString()
  }
];

export function createRecord(data) {
  const record = {
    ...data,
    id: Date.now(),
    createdAt: new Date().toISOString()
  };

  records.unshift(record);
  return record;
}

export function findAllRecords() {
  return records;
}

export function findRecordById(id) {
  return records.find((record) => String(record.id) === String(id));
}

export function getStats() {
  return {
    total: records.length,
    verified: records.filter((r) => r.status === "Verified").length,
    review: records.filter((r) => r.status === "Needs Review").length
  };
}
