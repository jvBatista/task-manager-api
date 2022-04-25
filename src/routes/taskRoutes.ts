import { Router, Request, Response } from "express";
import TaskController from "../controllers/taskController";
import AuthService from '../middleware/auth';

const auth = new AuthService();

const taskRoutes = Router();

taskRoutes.use(auth.authorize);

const taskController = new TaskController();

taskRoutes.post("/", (req: Request, res: Response)=>{
    taskController.createTask(req, res);
});

taskRoutes.get("/", (req: Request, res: Response)=>{
    taskController.getAllTasks(req, res);
});

taskRoutes.get("/:id", (req: Request, res: Response)=>{
    taskController.getOneTask(req, res);
});

taskRoutes.patch("/:id", (req: Request, res: Response)=>{
    taskController.updateTask(req, res);
});

taskRoutes.delete("/", (req: Request, res: Response)=>{
    taskController.deleteTask(req, res);
});

export default taskRoutes;