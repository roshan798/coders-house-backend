import { Router } from "express";
import authController from "./controllers/authController.js";
import activateController from "./controllers/activateController.js";
import roomsController from "./controllers/roomsController.js";
import authMiddleware from "./Middlewares/authMiddleware.js";
const router = Router();

router.post('/api/v1/send-otp', authController.sendOtp);
router.post('/api/v1/verify-otp', authController.verifyOtp);
router.post('/api/v1/activate', authMiddleware, activateController.activate);
router.get('/api/v1/refresh', authController.refreshAccessToken);
router.post('/api/v1/logout', authMiddleware, authController.logout);
router.post('/api/v1/rooms', authMiddleware, roomsController.create)
router.get('/api/v1/rooms', authMiddleware, roomsController.index)

export default router;