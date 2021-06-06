class Expenses {
    static schema = {
        name: 'Expense',
        primaryKey: 'id',
        properties: {
            id: 'string',
            description: 'string',
            value: 'double',
            pay: 'bool',
            createdAt: 'date',
            mainCategory: 'string',
            step: 'string?',
            secondaryCategory: 'string?',
            project: 'string',
            sync: 'bool?',
        }
    }
}

export default Expenses;
