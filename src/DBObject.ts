export default abstract class DBObject {
    public properties: any[] = [];

    getRecord(object: any) {
        const record = {};
        this.properties.map((property: any) => {
            if (getPropertyValue(object, property.attr)) {
                append[property.type](record, property.name, getPropertyValue(object, property.attr));
            }
        });

        return record;
    }
}

const getPropertyValue = (obj: any, name: string) => {
    return obj[name];
}

const append: any = {
    title: (record: any, propertyName: string, text: string) => {
        record[propertyName] = {
            'title': [{
                'text': {
                    "content": text,
                }
            }]
        }
    },
    select: (record: any, propertyName: string, text: string) => {
        record[propertyName] = {
            'select': {
                'name': text,
            } 
        }
    },
    number: (record: any, propertyName: string, text: string) => {
        record[propertyName] = {
            'number': text,
        }
    },
    date: (record: any, propertyName: string, startDate: string) => {
        record[propertyName] = {
            'date': {
                'start': startDate,
            }
        }
    },
    checkbox: (record: any, propertyName: string, value: boolean) => {
        record[propertyName] = {
            'checkbox': value,
        }
    },
    relation: (record: any, propertyName: string, value: string) => {
        record[propertyName] = {
            "relation": [
                {
                  "id": value,
                },
            ]
        }
    }
}
