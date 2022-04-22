import { Router } from "express";
import taskRoutes from "./routes/taskRoutes";
import listRoutes from "./routes/listRoutes";
import userRoutes from "./routes/userRoutes";

const router = Router();

router.use("/list", listRoutes);
router.use("/task", taskRoutes);
router.use("/user", userRoutes);


export default router;