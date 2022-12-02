import DBObject from './DBObject';

export default class RecurringExpense extends DBObject {
    public forecasted: boolean = false;

    constructor(forecasted: boolean) {
        super();

        this.forecasted = forecasted;

        this.properties = [
            {name: 'Forecasted', type: 'checkbox', attr: 'forecasted'},
        ];
    }

    getNotionRecord() {
        return super.getRecord(this);
    }
}
