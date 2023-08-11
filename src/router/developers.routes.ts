import express from "express";
import {
  createDeveloper,
  createDeveloperInfos,
  deleteDeveloper,
  getDevelopers,
  updateDevelopers,
} from "../controllers/developers.controller";

import {
  checkDeveloperInfoExistsMiddleware,
  checkEmailMiddleware,
  checkIdMiddleware,
} from "../middlewares/developers.middleware";

const router = express.Router();

router.post("/", checkEmailMiddleware, createDeveloper);
router.get("/:id", checkIdMiddleware, getDevelopers);
router.patch("/:id", checkIdMiddleware, checkEmailMiddleware, updateDevelopers);
router.delete("/:id", checkIdMiddleware, deleteDeveloper);

router.post(
  "/:id/infos",
  checkIdMiddleware,
  checkDeveloperInfoExistsMiddleware,
  createDeveloperInfos
);

export default router;
