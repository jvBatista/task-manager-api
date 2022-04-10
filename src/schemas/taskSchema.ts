import { Schema, model, Document } from "mongoose";

interface ITask extends Document {
    name: String,
    description: String,
    concluded: Boolean,
    list_id: String,
}

const taskSchema = new Schema<ITask>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    concluded: {
        type: Boolean,
        default: false
    },
    list_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

export default model<ITask>("Task", taskSchema);