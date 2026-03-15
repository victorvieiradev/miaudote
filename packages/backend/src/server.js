import express from 'express';
import cors from 'cors';
import catsRouter from './routes/cats.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/cats', catsRouter);

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});