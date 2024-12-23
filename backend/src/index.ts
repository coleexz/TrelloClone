import express from 'express';
import { sequelize} from './Database/database';
import dotenv from 'dotenv';

const app = express();
dotenv.config();


const port = process.env.PORT;

/*
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
*/

//routers:
//app.use('/api', apiRouter);

sequelize.sync({ force: true })
.then(() => {
    console.log('Database synced');
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
        console.log(`http://localhost:${port}`);
    });
});


app.get('/', (req, res) => {
  res.send('Hello World!');
});
