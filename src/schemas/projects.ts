class Projects {
    static schema = {
        name: 'Project',
        primaryKey: 'id',
        properties: {
            id: 'string',
            nickname: 'string',
            finish: 'bool',
            createdAt: 'date',
            updatedAt: 'date',
            finishAt: 'date?',
            user: 'string?',
            total: 'double',
            sync: 'bool?',
        }
    }
}

export default Projects;
