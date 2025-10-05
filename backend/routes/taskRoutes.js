import express from 'express';
import { protect } from "../middleware/authMiddleware.js";
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} from '../controller/taskController.js';

const router = express.Router();

router.get("/", protect, getTasks);
router.get("/:taskId", protect, getTaskById);
router.post("/", protect, createTask);
router.put("/:taskId", protect, updateTask);
router.delete("/:taskId", protect, deleteTask);
export default router;
