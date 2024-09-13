import dotenv from 'dotenv'
import { httpServer } from "./app.js";
import { dbConnect } from './db/connectDb.js';

dotenv.config({ path: "./.env" })


dbConnect().then(() => {
    httpServer.on("error", (error) => {
        console.log("ERRR : ", error);
        throw error;
    });
    httpServer.listen(process.env.PORT || 8080, () => {
        console.log(`server start at ${process.env.PORT}`);
    });

}).catch(() => {
    console.log("DB Connection Failed :", error);
})

