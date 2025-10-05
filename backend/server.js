import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./config/db.js"
import userRoutes from './routes/userRoutes.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api/user', userRoutes);
app.use('/api/task', taskRoutes);
app.get('/', (req, res) => {
    res.send('API is running...');
});
app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
});