import { Tracking } from './tracking'
import { Query } from './query'
class DbContext {
    constructor() {
        this._tracking = new Tracking();
    }
    get Foo() {
        return new Query(Foo, setState);
    }
    setState(_state, _entity) {
        this.tracking.addEntry({ state: _state, entity: _entity })
    }
    saveChanges() {
        //launch tracking agains the DB
    }
}


