import Realm from 'realm';
import Expenses from "../schemas/expenses";
import Categories from "../schemas/categories";
import Projects from "../schemas/projects";

function getRealm() {
    return Realm.open({
        schema: [
            Projects,
            Categories,
            Expenses.schema,
        ]
    });
}

export default getRealm;
