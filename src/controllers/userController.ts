import { Request, Response } from "express";
import { Types } from "mongoose";
import AuthService from "../middleware/auth";
import User from "../schemas/userSchema";
import List from "../schemas/listSchema";
import Task from "../schemas/taskSchema";

const auth = new AuthService();

export default class UserController {
    createUser = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if ((!email) || (!password)) return res.status(400).json({
                message: 'Falha ao criar usuário, é necessário informar um email e uma senha',
            });

            const emailFound = await User.findOne({ email });
            if (emailFound) return res.status(400).json({
                message: `Falha ao criar usuário, já existe usuário com email ${email}`,
            });

            await User.create(req.body);

            const user = req.body;
            req.body.password = undefined;

            res.status(200).json(user);
        } catch (error) {
            res.status(400).json({ error: error });
        }
    }

    login = async (req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            if ((!email) || (!password)) return res.status(400).json({
                message: 'Falha realizar login, é necessário informar um email e uma senha',
            });

            const user = await User.findOne({ email }).select('+password');
            if (!user) return res.status(404).send({ error: "Usuário não encontrado" });

            console.log(password == user.password);
            if (password != user.password) return res.status(401).json({ message: 'Senha inválida' });

            const token = auth.generateToken({
                id: user.id,
                email: user.email,
                password: user.password,
            });

            return res.status(200).json({
                id: user.id,
                email: user.email,
                token,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Falha ao logar no sistema" });
        }
    }

    getAllUsers = async (req: Request, res: Response) => {
        try {
            const data = await User.find();

            if (!data) return res.status(404).send({ error: "Nenhum usuário foi encontrado" });

            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    };

    getUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const token = req.headers.authorization?.split(' ')[1];
            const data = JSON.parse(await auth.decodeToken(token as string));

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Falha ao encontrar usuário, id informado inválido',
            });

            const user = await User.findById(id);

            if (!user) return res.status(404).send({ error: "Usuário não encontrado" });

            if (String(user?._id) !== data.id) return res.status(401).json({ message: 'Não autorizado' });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Falha ao processar a requisição" });
        }
    }

    deleteUser = async (req: Request, res: Response) => {
        try {
            const { id } = req.body;

            if (!Types.ObjectId.isValid(id)) return res.status(400).json({
                message: 'Falha ao deletar usuário, id informado inválido',
            });

            const user = await User.findByIdAndDelete(id);

            if (!user) return res.status(404).send({ error: "Usuário não encontrado" });

            const userLists = await List.find({ user_id: id });
            userLists.forEach(async list => await Task.deleteMany({ list_id: list._id }));

            await List.deleteMany({ user_id: id });

            res.status(200).json({ message: "Usuário deletado com sucesso!", user });
        } catch (error) {
            res.status(400).json({ message: "Falha ao deletar usuário" });
        }
    }
}