import { Client } from "@notionhq/client";
import dotenv from "dotenv";

dotenv.config();

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const EXPENSE_DB_ID: string = process.env.EXPENSE_DB_ID || ''; // 'e491438c8bec4160a103834f9dc57f4d';
console.log('LLL', NOTION_TOKEN, EXPENSE_DB_ID);

async function main() {
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  const response = await notion.databases.query({
    database_id: EXPENSE_DB_ID,
  });

  return response.results;
}

const getResponseObject = (results: any[]) => {
  const result = results.map(readExpense);
  return result;
}

const readExpense = (result: any) => {
  const expense = {};
  return result.properties ? readProperties(result.properties) : {};
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
    if (rollupType == 'array') {
      return property[type][rollupType][0] ? property[type][rollupType][0].title[0].plain_text : null;
    } else {
      return null;
    }
  } else {
    return null;
  }
}
main()
  // .then(results => console.log(JSON.stringify(results)))
  .then(getResponseObject)
  .then(result => console.log(JSON.stringify(result)))
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
