import app from "./app.js";
import connectDB from "./config/MongoDB.js";
import { port } from "./secret/secret.js";
import colors from "colors";

app.listen(port, async () => {
    console.log(`server is running on http://localhost:${port}`.bgBlue.bold);
    await connectDB();
})