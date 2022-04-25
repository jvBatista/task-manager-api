import { Router, Request, Response } from "express";
import UserController from "../controllers/userController";
import AuthService from '../middleware/auth';


const userRoutes = Router();

const userController = new UserController();

userRoutes.post("/", (req: Request, res: Response) => {
    userController.createUser(req, res);
});

userRoutes.post("/login", (req: Request, res: Response) => {
    userController.login(req, res);
});

userRoutes.get("/", (req: Request, res: Response) => {
    userController.getAllUsers(req, res);
});

userRoutes.get("/:id", (req: Request, res: Response) => {
    const auth = new AuthService();
    
    auth.authorize(req, res, () => { 
        userController.getUser(req, res);
    })
});

userRoutes.delete("/", (req: Request, res: Response) => {
    userController.deleteUser(req, res);
});

export default userRoutes;