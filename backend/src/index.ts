import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { sequelize } from './Database/database';
dotenv.config();

const app = express();
const port = process.env.PORT;

//Routers
import UserRouter from './Routers/UserRouter';
import WorkspacesRouter from './Routers/WorkspacesRouters';
import CardsRouter from './Routers/CardsRouters';

app.use(express.json());
app.use('/users', UserRouter);
app.use('/workspaces', WorkspacesRouter);
app.use('/cards', CardsRouter);

// Default routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// Test database connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to the database has been established successfully.');
  })
  .catch((error) => {
    console.error('Unable to connect to the database:', error);
  });


export default app;
