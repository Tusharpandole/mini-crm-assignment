import mongoose, { Connection } from 'mongoose';

let isConnected = false;

export const connectToDB = async (): Promise<void> => {
    mongoose.set('strictQuery', true);

    if(isConnected) {
        console.log("MongoDB already connected");
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI!, {
            dbName: "mini_crm",
        })

        isConnected = true;

        console.log("MongoDB connected");
    } catch(error) {
        console.log(error);
    }
}