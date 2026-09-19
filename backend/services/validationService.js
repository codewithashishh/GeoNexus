export function validateRecordData(record, confidence = {}) {
  const fields = [
    ["ownerName", "Owner Name"],
    ["khataNumber", "Khata Number"],
    ["plotNumber", "Plot Number"],
    ["area", "Area"],
    ["village", "Village"],
    ["district", "District"],
    ["state", "State"]
  ];

  const results = {};
  const errors = [];
  const warnings = [];

  for (const [key, label] of fields) {
    const value = String(record[key] ?? "").trim();

    if (!value) {
      results[key] = { status: "missing", message: `${label} is missing` };
      errors.push(`${label} is missing`);
      continue;
    }

    if (key === "khataNumber" && !/^\\d+$/.test(value)) {
      results[key] = { status: "invalid", message: "Khata Number should be numeric" };
      errors.push("Khata Number should be numeric");
      continue;
    }

    if (key === "plotNumber" && !/^\\d+(\\/\\d+)?$/.test(value)) {
      results[key] = { status: "invalid", message: "Use formats such as 367 or 367/2" };
      errors.push("Plot Number format is invalid");
      continue;
    }

    if (key === "area" && !/\\d+(\\.\\d+)?/.test(value)) {
      results[key] = { status: "invalid", message: "Area must contain a number" };
      errors.push("Area must contain a number");
      continue;
    }

    const score = Number(confidence[key] ?? 100);

    if (score < 70) {
      results[key] = { status: "review", message: "Low confidence — human verification required" };
      warnings.push(`${label} needs human review`);
    } else if (score < 85) {
      results[key] = { status: "review", message: "Medium confidence — review recommended" };
      warnings.push(`${label} should be reviewed`);
    } else {
      results[key] = { status: "valid", message: "Field passed validation" };
    }
  }

  return {
    valid: errors.length === 0 && warnings.length === 0,
    results,
    errors,
    warnings
  };
}
