import mongoose, { ConnectOptions } from "mongoose";

const databaseConnect = () => {
    mongoose.connect(
        process.env.DB_CONNECTION || "mongodbstring",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as ConnectOptions,
        (err) => {
            if (!err) console.log("Conexão estabelecida com MongoDB");
            else console.log(`Falha ao conectar com MongoDB com erro ${err}`);
        }
    );
}

export default databaseConnect;