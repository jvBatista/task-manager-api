import { Request, Response } from "express";
import { Types } from "mongoose";
import List from "../schemas/listSchema";
import Task from "../schemas/taskSchema";

export default class ListController {
    createList = async (req: Request, res: Response) => {
        try {
            if (!(req.body.name)) return res.status(400).json({
                message: 'Falha ao criar a lista, é necessário informar o nome',
            });

            const newList = await List.create(req.body);

            res.status(200).json(newList);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    };

    getAllLists = async (req: Request, res: Response) => {
        try {
            const data = await List.find({});

            if (!data) return res.status(404).send({ error: "Nenhuma lista foi encontrada" });

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    getOneList = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Falha ao encontrar a lista, id informado inválido',
            });

            const list = await List.findById(id);

            if (!list) return res.status(404).send({ error: "Lista não encontrada" });

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