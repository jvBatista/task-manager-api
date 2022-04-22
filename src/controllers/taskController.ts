import { Request, Response } from "express";
import { Types } from "mongoose";
import Task from "../schemas/taskSchema";
import List from "../schemas/listSchema";
import AuthService from '../middleware/auth';

const auth = new AuthService();

export default class TaskController {
    createTask = async (req: Request, res: Response) => {
        try {
            if (!req.body.list_id) return res.status(400).json({
                message: 'Falha ao criar a tarefa, é necessário informar o id de sua lista',
            });

            if (!Types.ObjectId.isValid(req.body.list_id)) return res.status(400).json({
                message: 'Falha ao criar a tarefa, id de lista inválido',
            });

            const list = await List.findById(req.body.list_id);
            if (!list) return res.status(400).json({
                message: 'Falha ao criar a tarefa, não existe lista com id informado',
            });

            if (!req.body.name) return res.status(400).json({
                message: 'Falha ao criar a tarefa, é necessário informar o nome',
            });

            const newTask = await Task.create(req.body);

            res.status(200).json(newTask);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    };

    getAllTasks = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const user = JSON.parse(await auth.decodeToken(token as string));

            const userLists = await List.find({ user_id: user.id });
            const allTasks = await Task.find();
            // const data = await Task.find();
            const userTasks = allTasks.filter(task => {
                if (userLists.filter(list => list.id == task.list_id).length > 0) return task;
            });

            if (!userTasks.length) return res.status(404).send({ error: "Nenhuma tarefa foi encontrada" });

            res.status(200).json(userTasks);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    getOneTask = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const token = req.headers.authorization?.split(' ')[1];
            const user = JSON.parse(await auth.decodeToken(token as string));

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Tarefa não encontrada, id informado inválido',
            });

            const task = await Task.findById(id);

            if (!task) return res.status(404).send({ error: "Tarefa não encontrada" });

            const list = await List.findById(task.list_id);
            if (String(list?.user_id) !== user.id) return res.status(401).send({ error: "Não autorizado" });

            res.status(200).json(task);
        } catch (error) {
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    updateTask = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { concluded, description } = req.body;

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Tarefa não foi atualizada, id informado inválido',
            });

            const task = await Task.findByIdAndUpdate(id, {
                concluded,
                description
            });

            if (!task) return res.status(404).send({ error: "Tarefa não encontrada" });

            res.status(200).json({ message: 'Tarefa atualizada com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    deleteTask = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Tarefa não foi deletada, id informado inválido',
            });

            const task = await Task.findByIdAndDelete(id);

            if (!task) return res.status(404).send({ error: "Tarefa não encontrada" });

            res.status(200).json({ message: "Tarefa deletada com sucesso!", task });
        } catch (error) {
            res.status(400).json({ message: "Falha ao deletar a tarefa" });
        }
    };
};