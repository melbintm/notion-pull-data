import DBObject from './DBObject';

export default class Forecast extends DBObject {
    public name: string = '';
    public date: string = '';
    public amount: number = 0;
    public realm: string = '';
    public status: string = '';
    public recurringExpense: string = '';

    constructor(name: string, date: string, amount: number, realm: string, status: string, recurringExpense: string) {
        super();

        this.name = name;
        this.date = date;
        this.amount = amount;
        this.realm = realm;
        this.status = status;
        this.recurringExpense = recurringExpense;

        this.properties = [
            {name: 'Name', type: 'title', attr: 'name'},
            {name: 'Date', type: 'date', attr: 'date'},
            {name: 'Amount', type: 'number', attr: 'amount'},
            {name: 'Realm', type: 'relation', attr: 'realm'},
            {name: 'Status', type: 'select', attr: 'status'},
            {name: 'Recurring Expense', type: 'relation', attr: 'recurringExpense'}
        ];
    }

    getNotionRecord() {
        return super.getRecord(this);
    }
}
