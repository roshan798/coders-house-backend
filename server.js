import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
dotenv.config();
import router from "./routes.js";
import cookieParser from 'cookie-parser'
const app = express();
const PORT = process.env.PORT || 8080
import connectDB from './database.js'
connectDB();
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));
const corsOptions = {
    origin: ["http://localhost:5173"],
    credentials: true,
}
app.use(cors(corsOptions))
app.use('/storage', express.static('storage'));
app.use(express.json({
    limit: '8mb',
}))
app.use(router)
router.get('/', (req, res) => {
    res.json({
        msg: "Welcome to coders house"
    })
});
app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
})
