import { Schema, model, Document } from "mongoose";

interface IList extends Document {
    name: String,
    description: String
};

const listSchema = new Schema<IList>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

export default model<IList>("List", listSchema);