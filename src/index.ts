import express from 'express';
import { Client } from "@notionhq/client";
import dotenv from "dotenv";
import { connectDb, getNotionDbId } from "./db";

dotenv.config();

const PORT = process.env.PORT || 2200;
const NOTION_TOKEN = process.env.NOTION_TOKEN;
const EXPENSE_DB_ID: string = process.env.EXPENSE_DB_ID || '';

const app = express();

connectDb()
. then(() => console.log('Connected to Database'))
.then(connectNotion)
.then((notion: any) => {
    console.log('Connected to Notion API');

    app.get('/hello', (request, response) => response.send('hello world'));

    app.get('/db/:name', (request, response) => {
      console.log('db called', request.params.name);
      getNotionDbId(request.params.name)
        .then((dbId: string) => {
          getDatabaseRecords(notion, dbId)
          .then(getResponseObject)
            .then(results => {
                console.log(JSON.stringify(results));
                response.send(results);
            });
        })
        .catch((err: any )=> {
          response.statusCode = 404;
          response.send();
        })
    });

    app.use('/', (request, response) => {
      response.statusCode = 404;
      response.send();
    });
    
    app.listen(PORT, () => {
        console.log('Listening to', PORT)
    });
})
.catch((err: any) => {
    console.error(err);
    process.exit(1);
});

async function connectNotion() {
    return new Client({
      auth: process.env.NOTION_TOKEN,
    });
}

async function getExpenses(notion: any) {
    const response = await notion.databases.query({
        database_id: EXPENSE_DB_ID,
    });

    return response.results;
}

async function getDatabaseRecords(notion: any, dbId: string) {
  const response = await notion.databases.query({
      database_id: dbId,
  });

  console.log(JSON.stringify(response.results));
  return response.results;
}

const getResponseObject = (results: any[]) => {
    const result = results.map(readExpense);
    return result;
  }
  
  const readExpense = (result: any) => {
    const expense = result.properties ? readProperties(result.properties) : {};
    expense.id = result.id;
    expense.createdTime = result.created_time;
    expense.lastEditedTime = result.last_edited_time;
    return expense;
  };
  
  const readProperties = (properties: any) => {
    const keys = Object.keys(properties);
    const expense: any = {};
    for (const key of keys) {
      expense[key] = readProperty(properties[key]);
    }
  
    return expense;
  }
  const readProperty = (property: any) => {
    const type = property.type;
    if (type == 'date') {
      return property[type] && property[type].start;
    } else if (type == 'number') {
      return property[type];
    } else if (type == 'formula') {
      return property[type] && property[type].boolean;
    } else if (type == 'title') {
      return property[type] &&
        property[type][0] &&
        property[type][0].plain_text
    } else if (type == 'relation') {
      return property[type] &&
        property[type][0] ? property[type][0].id : null;
    } else if (type == 'rollup') {
      const rollupType =  property[type] &&
        property[type].type;
      if (rollupType == 'array' && property[type][rollupType].length) {
        const rollupValueType = property[type][rollupType][0].type;
        if (rollupValueType == 'title') {
          return property[type][rollupType][0].title[0].plain_text;
        } else if (rollupValueType == 'formula') {
          const formulaType = property[type][rollupType][0].formula.type;
          return property[type][rollupType][0].formula[formulaType];
        }

        return null;
      } else {
        return null;
      }
    } else {
      return null;
    }
}
