import { Client } from '@notionhq/client';

export async function connectNotion() {
    return new Client({
      auth: process.env.NOTION_TOKEN,
    });
}

export async function getDatabaseRecords(notion: any, dbId: string) {
    const response = await notion.databases.query({
        database_id: dbId,
    });
  
    return response.results;
}
  
export const getResponseObject = (results: any[]) => {
    const result = results.map(readRecord);
    return result;
}
    
export const readRecord = (result: any) => {
    const record = result.properties ? readProperties(result.properties) : {};
    record.id = result.id;
    record.createdTime = result.created_time;
    record.lastEditedTime = result.last_edited_time;
    return record;
};
    
export const readProperties = (properties: any) => {
    const keys = Object.keys(properties);
    const property: any = {};
    for (const key of keys) {
        property[key] = readProperty(properties[key]);
    }

    return property;
}

export const readProperty: any = (property: any) => {
    const type = property.type;
    if (type == 'date') {
        return readDate(property);
    } else if (type == 'number') {
        return readNumber(property);
    } else if (type == 'formula') {
        return readFormula(property);
    } else if (type == 'title') {
        return readTitle(property);
    } else if (type == 'relation') {
        return readRelation(property);
    } else if (type == 'rollup') {
        return readRollup(property);
    } else if (type == 'boolean') {
        return readBoolean(property);
    } else if (type == 'array') {
        return readArray(property);
    } else if (type == 'select') {
        return readSelect(property);
    } else {
        return null;
    }
}

const readDate = (property: any) => property['date'] && property['date'].start;

const readNumber = (property: any) => property['number'];

const readFormula = (property: any) => readProperty(property['formula']);

const readBoolean = (property: any) => property['boolean'];

const readTitle = (property: any) => {
    if (property['title'] && property['title'].length) {
        return property['title'].map((arr: any) => arr.plain_text).join('');
    }

    return null;
}

const readRollup = (property: any) => {
    const rollupValue = property['rollup'];
    return readProperty(rollupValue);
}

const readArray = (property: any) => {
    if (property['array'] && property['array'].length == 1) {
        return readProperty(property['array'][0]);
    } else if (property['array'] && property['array'].length) {
        return property['array'].map(readProperty);
    }
    return null;
}

const readRelation = (property: any) => {
    const relationValue = property['relation'];
    if (relationValue instanceof Array) {
        if (relationValue.length && relationValue.length == 1) {
            return relationValue[0].id;
        } else if (relationValue.length) {
            return relationValue.map(v => v.id);
        }
    }

    return null;
}

const readSelect = (property: any) => {
    return property['select']? property['select'].name : null;
}
