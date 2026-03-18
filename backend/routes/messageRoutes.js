import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import MessageController from "../controllers/MessageController.js";

const router = express.Router();

router.get(
  "/:conversationId/messages",
  authMiddleware,
  MessageController.getMessages,
);

export default router;
