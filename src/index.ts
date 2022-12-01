import dotenv from "dotenv";
dotenv.config();

import express from 'express';
import { connectDb } from './db';
import { connectNotion, } from './notion';
import router from './router';
import service from './service';

const PORT = process.env.PORT || 2200;

const app = express();

connectDb()
    .then(() => console.log('Connected to Database'))
    .then(connectNotion)
    .then((notion: any) => {
        service.setNotionClient(notion);
        console.log('Connected to Notion API');

        app.use(router);

        app.listen(PORT, () => {
            console.log('Listening to', PORT)
        });
    })
    .catch((err: any) => {~~
        console.error(err);
        process.exit(1);
    });
