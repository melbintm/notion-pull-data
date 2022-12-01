import express from 'express';
import service from './service';
import { getDatabaseRecords, getResponseObject } from './notion';
import { getNotionDbId } from './db';

const router = express.Router();

router.get('/hello', (request, response) => response.send('hello'));

router.get('/db/:name', (request, response) => {
    console.log('db called', request.params.name);
    const notion = service.getNotionClient();
    getNotionDbId(request.params.name)
        .then((dbId: string) => {
            getDatabaseRecords(notion, dbId)
            .then(getResponseObject)
            .then(results => {
                response.send(results);
            })
            .catch(err => {
                console.log('error', err);
            })
        })
        .catch((err: any )=> {
            response.statusCode = 404;
            response.send();
        })
});

router.use('/', (request, response) => {
  response.statusCode = 404;
  response.send();
});

export default router;
