import { app } from "./app.js";
import { configDotenv } from "dotenv";
import connectDB from "./db/index.js";

configDotenv()


const port = process.env.PORT || 8000;
connectDB()
.then(() =>{
    app.on("error", error =>{
        console.log('error from express', error);
    })
    app.listen(port, () =>{
        console.log(`Server is running at port: ${port}`);
    })
})
.catch(error =>{
    console.log('mongoDB connection failed!!!', error);
  })

