import { Request, Response } from "express";
import { Types } from "mongoose";
import List from "../schemas/listSchema";
import User from "../schemas/userSchema";
import Task from "../schemas/taskSchema";
import AuthService from '../middleware/auth';

const auth = new AuthService();

export default class ListController {
    createList = async (req: Request, res: Response) => {
        try {
            if (!(req.body.name && req.body.user_id)) return res.status(400).json({
                message: 'Falha ao criar a lista, é necessário informar o nome e o id do usuário',
            });

            if (!Types.ObjectId.isValid(req.body.user_id)) return res.status(400).json({
                message: 'Falha ao criar a lista, id de usuário inválido',
            });

            const user = await User.findById(req.body.user_id);
            if (!user) return res.status(400).json({
                message: 'Falha ao criar a lista, não existe usuário com id informado',
            });

            const newList = await List.create(req.body);

            res.status(200).json(newList);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    };

    getAllLists = async (req: Request, res: Response) => {
        try {
            const token = req.headers.authorization?.split(' ')[1];
            const user = JSON.parse(await auth.decodeToken(token as string));

            const data = await List.find({ user_id: user.id });
            // const data = await List.find();

            if (!data.length) return res.status(404).send({ error: "Nenhuma lista foi encontrada" });

            res.status(200).json(data);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    getOneList = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const token = req.headers.authorization?.split(' ')[1];
            const user = JSON.parse(await auth.decodeToken(token as string));

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Falha ao encontrar a lista, id informado inválido',
            });

            const list = await List.findById(id);

            if (!list) return res.status(404).send({ error: "Lista não encontrada" });

            if (String(list.user_id) !== user.id) return res.status(401).send({ error: "Não autorizado" });

            const tasks = await Task.find({ list_id: id });

            res.status(200).json({ list, tasks });
        } catch (error) {
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    updateList = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const { description } = req.body;

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Falha ao atualizar a lista, id informado inválido',
            });

            const list = await List.findByIdAndUpdate(id, { description });

            if (!list) return res.status(404).send({ error: "Lista não encontrada" });

            res.status(200).json({ message: 'Lista atualizada com sucesso' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    deleteList = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Falha ao deletar a lista, id informado inválido',
            });

            const list = await List.findByIdAndDelete(id);

            if (!list) return res.status(404).send({ error: "Lista não encontrada" });

            await Task.deleteMany({ list_id: id });

            res.status(200).json({ message: "Lista deletada com sucesso!", list });
        } catch (error) {
            res.status(400).json({ message: "Falha ao deletar a lista" });
        }
    };
};