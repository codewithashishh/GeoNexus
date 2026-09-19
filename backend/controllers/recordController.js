import {
  runDemoOCR,
  extractFields,
  scoreConfidence
} from "../services/ocrService.js";

import {
  validateRecord as validateData
} from "../services/validationService.js";

import {
  createRecord,
  findAllRecords,
  findRecordById
} from "../models/recordModel.js";

export async function processRecord(req, res) {
  try {
    const ocr = runDemoOCR(req.file);

    const record = extractFields(ocr.rawText);
    const confidence = scoreConfidence();

    const validation = validateData(record, confidence);

    res.json({
      success: true,
      record,
      confidence,
      validation,
      source: ocr.source
    });
  } catch (error) {
    console.error("Process record error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function validateRecord(req, res) {
  try {
    const { record, confidence } = req.body;

    const validation = validateData(record, confidence);

    res.json({
      success: true,
      validation
    });
  } catch (error) {
    console.error("Validation error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function saveRecord(req, res) {
  try {
    const data = req.body;

    const record = data.record
      ? {
          ...data.record,
          confidence: data.confidence,
          validation: data.validation,
          status: data.status || "Verified"
        }
      : {
          ...data,
          status: data.status || "Verified"
        };

    const saved = createRecord(record);

    res.json({
      success: true,
      record: saved
    });
  } catch (error) {
    console.error("Save record error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getRecords(req, res) {
  res.json({
    success: true,
    records: findAllRecords()
  });
}

export async function getRecord(req, res) {
  const record = findRecordById(req.params.id);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Record not found"
    });
  }

  res.json({
    success: true,
    record
  });
}