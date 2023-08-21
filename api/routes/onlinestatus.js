import express from "express";
import { getOnlineFriends, updateOnlineStatus, getOnlineUsers } from "../controllers/onlinestatus.js";

const router = express.Router();

router.get("/friends", getOnlineFriends);
router.get("/users", getOnlineUsers);
router.put("/status", updateOnlineStatus);

export default router; 
