import express from 'express';
import router from './routes/index.js';

const Port = Number(process.env.PORT) || 5000;
const app = express();

app.use(express.json());
app.use('/', router);

app.listen(Port, () => {
    console.log(`Server running on port ${Port}`);
    });

export default app;