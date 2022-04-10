import {Router} from "express";
import taskRoutes from "./routes/taskRoutes";
import listRoutes from "./routes/listRoutes";

const router = Router();

router.use("/list", listRoutes);
router.use("/task", taskRoutes);

export default router;