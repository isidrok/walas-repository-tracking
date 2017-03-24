import { Tracking } from './tracking';
import { Query } from './query';
import { STATES } from './states';

class DbContext {
    constructor() {
        this._tracking = new Tracking();
    }
    setState(entity, state) {
        this._tracking.addEntry({ entity: entity, state: state })
    }
    saveChanges() {
        //TODO: implement UOW
        this._tracking.reset();
    }
}



