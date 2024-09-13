import mongoose from "mongoose";

async function dbConnect() {
    try {
        const connectionInstance = await mongoose.connect(
            `${process.env.MONGO_URI}`
        );
        // console.log(connectionInstance?.connections[0].readyState, "connectionInstance")
        console.log(
            `MONGOdb connected at host : ${connectionInstance.connection.host}`
        );
    } catch (error) {
        console.error("Error In DB Connect :", error);
        process.exit(1);
    }
}

export { dbConnect };