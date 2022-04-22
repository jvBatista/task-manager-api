import { Schema, model, Document } from 'mongoose';

interface IUser extends Document {
    email: String;
    password: string;
}

const userSchema = new Schema<IUser>({
    email: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }
});

export default model<IUser>("User", userSchema);