// index.js
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import userRoutes from './routes/userRoute.js';
const PORT = process.env.PORT;
dotenv.config();

const app = express();


// Debugging Middleware
app.use((req, res, next) => {
    console.log('Request received:', req.method, req.url);
    console.log('Request headers:', req.headers);
    next();
});

app.use(
    cors({
        origin: [process.env.FRONTEND_URL],
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
)

app.use(express.json());

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    console.log('Parsed request body:', req.body);
    next();
});

// Use the user routes
app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
