import { Schema, model, Document } from "mongoose";

interface IList extends Document {
    name: String,
    description: String;
    user_id: String;
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
    },
    user_id: {
        type: Schema.Types.ObjectId,
        required: true
    }
});

export default model<IList>("List", listSchema);