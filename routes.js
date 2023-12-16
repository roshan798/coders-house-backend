import { Router } from "express";
import authController from "./controllers/authController.js";
import activateController from "./controllers/activateController.js";
import authMiddleware from "./Middlewares/authMiddleware.js";
const router = Router();

router.post('/api/v1/send-otp', authController.sendOtp);
router.post('/api/v1/verify-otp', authController.verifyOtp);
router.post('/api/v1/activate',authMiddleware, activateController.activate);
router.get('/api/v1/refresh', authController.refreshAccessToken);

export default router;