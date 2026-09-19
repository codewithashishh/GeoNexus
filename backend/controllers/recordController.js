import {
  processDemoOCR,
  processUploadedDocument
} from "../services/ocrService.js";

import {
  validateRecord
} from "../services/validationService.js";

import {
  createRecord,
  getRecords,
  getRecordById
} from "../models/recordModel.js";

export async function processRecord(req, res) {
  try {
    const file = req.file;

    const ocrResult = await processUploadedDocument(file);

    const validation = validateRecord(
      ocrResult.record,
      ocrResult.confidence
    );

    res.json({
      success: true,
      record: ocrResult.record,
      confidence: ocrResult.confidence,
      validation
    });

  } catch (error) {
    console.error("Process record error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function processDemoRecord(req, res) {
  try {
    const ocrResult = await processDemoOCR();

    const validation = validateRecord(
      ocrResult.record,
      ocrResult.confidence
    );

    res.json({
      success: true,
      record: ocrResult.record,
      confidence: ocrResult.confidence,
      validation
    });

  } catch (error) {
    console.error("Demo processing error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function validateRecordEndpoint(req, res) {
  try {
    const { record, confidence } = req.body;

    const validation = validateRecord(
      record,
      confidence
    );

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
    const { record, confidence, validation } = req.body;

    const saved = await createRecord({
      record,
      confidence,
      validation
    });

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

export async function listRecords(req, res) {
  try {
    const records = await getRecords();

    res.json({
      success: true,
      records
    });

  } catch (error) {
    console.error("List records error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}

export async function getRecord(req, res) {
  try {
    const record = await getRecordById(req.params.id);

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

  } catch (error) {
    console.error("Get record error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
}