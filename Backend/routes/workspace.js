import express from "express";
import { validateRequest } from "zod-express-middleware";
import { workspaceSchema } from "../libs/validateSchema.js";
import authMiddleware from "../middleware/auth-middleware.js";
import { createWorkspace, getWorkspaces } from "../controllers/workspace.js";
const router = express.Router();

// POST /api/workspaces
router.post(
  "/",
  authMiddleware,
  validateRequest({ body: workspaceSchema }),
  createWorkspace
);

router.get("/", authMiddleware, getWorkspaces);

export default router;
