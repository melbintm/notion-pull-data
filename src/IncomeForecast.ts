import DBObject from './DBObject';

export default class IncomeForecast extends DBObject {
    public name: string = '';
    public date: string = '';
    public amount: number = 0;
    public status: string = '';
    public recurringIncome: string = '';

    constructor(name: string, date: string, amount: number, status: string, recurringIncome: string) {
        super();

        this.name = name;
        this.date = date;
        this.amount = amount;
        this.status = status;
        this.recurringIncome = recurringIncome;

        this.properties = [
            {name: 'Name', type: 'title', attr: 'name'},
            {name: 'Date', type: 'date', attr: 'date'},
            {name: 'Amount', type: 'number', attr: 'amount'},
            {name: 'Status', type: 'select', attr: 'status'},
            {name: 'Recurring Income', type: 'relation', attr: 'recurringIncome'}
        ];
    }

    getNotionRecord() {
        return super.getRecord(this);
    }
}
