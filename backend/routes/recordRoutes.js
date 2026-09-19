import { Router } from "express";
import multer from "multer";
import {
  processRecord,
  validateRecord,
  saveRecord,
  getRecords,
  getRecord
} from "../controllers/recordController.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/process", upload.single("document"), processRecord);
router.post("/validate", validateRecord);
router.post("/", saveRecord);
router.get("/", getRecords);
router.get("/:id", getRecord);

export default router;
