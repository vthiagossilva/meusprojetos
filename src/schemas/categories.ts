class Categories {
    static schema = {
        name: 'Category',
        primaryKey: 'id',
        properties: {
            id: 'string',
            nickname: 'string',
            type: 'string', // main, step, secondary
            project: 'string',
            sync: 'bool?',
        }
    }
}

export default Categories;
