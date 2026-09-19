import {
  runDemoOCR,
  extractFields,
  scoreConfidence
} from "../services/ocrService.js";
import { validateRecordData } from "../services/validationService.js";
import {
  createRecord,
  findAllRecords,
  findRecordById
} from "../models/recordModel.js";

export function processRecord(req, res) {
  const ocr = runDemoOCR(req.file);
  const record = extractFields(ocr.rawText);
  const confidence = scoreConfidence();

  res.json({
    success: true,
    demo: true,
    source: ocr.source,
    rawText: ocr.rawText,
    record,
    confidence
  });
}

export function validateRecord(req, res) {
  const { record, confidence } = req.body;
  const validation = validateRecordData(record, confidence);

  res.json({
    success: true,
    ...validation
  });
}

export function saveRecord(req, res) {
  const saved = createRecord(req.body);
  res.status(201).json({
    success: true,
    record: saved
  });
}

export function getRecords(_req, res) {
  res.json({
    success: true,
    records: findAllRecords()
  });
}

export function getRecord(req, res) {
  const record = findRecordById(req.params.id);

  if (!record) {
    return res.status(404).json({
      success: false,
      message: "Record not found"
    });
  }

  res.json({ success: true, record });
}
