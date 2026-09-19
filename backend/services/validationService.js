const definitions = [
  ["ownerName", "Owner Name"],
  ["khataNumber", "Khata Number"],
  ["plotNumber", "Plot Number"],
  ["area", "Area"],
  ["village", "Village"],
  ["district", "District"],
  ["state", "State"]
];

export function validateRecord(record, confidence = {}) {
  const results = {};
  const errors = [];
  const warnings = [];

  for (const [key, label] of definitions) {
    const value = String(record?.[key] ?? "").trim();
    const score = Number(confidence[key] ?? 0);

    if (!value) {
      results[key] = {
        status: "missing",
        message: `${label} is required.`
      };

      errors.push(`${label} is missing`);
      continue;
    }

    if (key === "khataNumber" && !/^\d+$/.test(value)) {
      results[key] = {
        status: "invalid",
        message: "Use a numeric Khata Number."
      };

      errors.push(`${label} is invalid`);
      continue;
    }

    if (key === "plotNumber" && !/^\d+(\/\d+)?$/.test(value)) {
      results[key] = {
        status: "invalid",
        message: "Use a format such as 367 or 367/2."
      };

      errors.push(`${label} is invalid`);
      continue;
    }

    if (key === "area" && !/^\d+(\.\d+)?/.test(value)) {
      results[key] = {
        status: "invalid",
        message: "Area must contain a numeric value."
      };

      errors.push(`${label} is invalid`);
      continue;
    }

    if (score < 70) {
      results[key] = {
        status: "review",
        message: "Low confidence. Human verification required."
      };

      warnings.push(`${label} needs review`);
    } else if (score < 85) {
      results[key] = {
        status: "review",
        message: "Medium confidence. Review recommended."
      };

      warnings.push(`${label} should be reviewed`);
    } else {
      results[key] = {
        status: "valid",
        message: "Validation passed."
      };
    }
  }

  return {
    valid: errors.length === 0 && warnings.length === 0,
    results,
    errors,
    warnings
  };
}