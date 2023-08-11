import express from "express";
import {
  createProject,
  getProject,
  updateProject,
} from "../controllers/projects.controller";

const router = express.Router();
router.post("/", createProject);
router.get("/:id", getProject);
router.patch("/:id", updateProject);

export default router;
