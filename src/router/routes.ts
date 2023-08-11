import devRoutes from "./developers.routes";
import projectRoutes from "./projects.routes";
import express from "express";

const router = express.Router();

router.use("/developers", devRoutes);
router.use("/projects", projectRoutes);

export default router;
