import { StateManager } from './statemanager';
import { Query } from './query';
import { STATES } from './states';

class DbContext {
    constructor() {
        this._stateManager = new StateManager();
        this._conventions = [];
        configuration(this._conventions);
    }
    setState(entity, state) {
        this._stateManager.addEntry({ entity: entity, state: state })
    }
    saveChanges() {
        //TODO: implement UOW
        this._stateManager.reset();
    }
    configuration() { }
}



