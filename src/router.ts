import express from 'express';
import service from './service';
import {
    getAllRecords,
    getResponseObject,
    getOneRecord,
    readProperties,
    generateForecastRecords,
    createRecord,
    updateRecord,
} from './notion';
import RecurringExpense from './RecurringExpense';
import { getNotionDbId } from './db';

const router = express.Router();

router.get('/hello', (request, response) => response.send('hello'));

router.get('/db/:name', (request, response) => {
    console.log('db called', request.params.name);
    const notion = service.getNotionClient();
    getNotionDbId(request.params.name)
        .then((dbId: string) => {
            getAllRecords(notion, dbId)
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

router.get('/create/forecastByRecurringExpense/:recurringExpenseId', (request, response) => {
    let forecastDbId = '';
    getNotionDbId('Forecast')
    .then((queriedForecastDbId: string) => {
        forecastDbId = queriedForecastDbId;
    })
    .then(() => {
        getOneRecord(service.getNotionClient(), request.params.recurringExpenseId)
        .then((result: any) => result.properties)
        .then(readProperties)
        .then((recurringExpenseRecord: any) => {
            if (recurringExpenseRecord.Forecasted == null || !recurringExpenseRecord.Forecasted) {
                return generateForecastRecords(
                    recurringExpenseRecord.Name,
                    recurringExpenseRecord['Start Date'],
                    recurringExpenseRecord['End Date'],
                    recurringExpenseRecord['Total Amount'],
                    recurringExpenseRecord.Interval,
                    recurringExpenseRecord.Realm,
                    request.params.recurringExpenseId,
                );
            }
    
            return [];
        })
        .then((forecastRecords: any) => {
            return Promise.all(forecastRecords.map((forecastRecord: any) => createRecord(service.getNotionClient(), forecastDbId, forecastRecord.getNotionRecord())));
        })
        .then((result: any) => {
            if (result.length > 0) {
                // TODO: Update Recurring Expense with Forecasted as true
                return updateRecord(service.getNotionClient(), request.params.recurringExpenseId, (new RecurringExpense(true)).getNotionRecord())
            }
            return '';
        })
        .then((result: any) => {
            response.send(result);
        });
    });
});

router.get('/test/:pageId', (request, response) => {
    getOneRecord(service.getNotionClient(), request.params.pageId)
    .then((result: any) => {
        response.send(result);
    })
});

router.use('/', (request, response) => {
  response.statusCode = 404;
  response.send();
});

export default router;
