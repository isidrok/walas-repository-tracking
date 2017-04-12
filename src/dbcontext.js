import { StateManager } from './statemanager';
import { getMetaEntities } from 'walas-meta-api';

export class DbContext {
    constructor() {
        this._stateManager = new StateManager();
        this._conventions = [];
        this.metaEntities = getMetaEntities(DbContext);
    }

    setState(entity, state) {
        this._stateManager.addEntry({ entity: entity, state: state })
    }
    saveChanges() {
        //TODO: implement UOW
        this._stateManager.reset();
    }
    config() {
        this.metaEntities.forEach(entity => {
            this._conventions.map(convention => new convention(entity.entity, entity.meta).exec());
        });
    }
}



