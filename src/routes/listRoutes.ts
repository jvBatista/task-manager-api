import { Router, Request, Response } from "express";
import ListController from "../controllers/listController";

const listRoutes = Router();

const listController = new ListController();

listRoutes.post("/", (req: Request, res: Response)=>{
    listController.createList(req, res);
});

listRoutes.get("/all", (req: Request, res: Response)=>{
    listController.getAllLists(req, res);
});

listRoutes.get("/:id", (req: Request, res: Response)=>{
    listController.getOneList(req, res);
});

listRoutes.patch("/:id", (req: Request, res: Response)=>{
    listController.updateList(req, res);
});

listRoutes.delete("/", (req: Request, res: Response)=>{
    listController.deleteList(req, res);
});

export default listRoutes;