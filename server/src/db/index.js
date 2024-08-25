import dotenv from "dotenv"

const connectDB = async() =>{
    try {
        
    } catch (error) {
        console.log("MongoDB connection error", error);
        process.exit(1)
    }
}