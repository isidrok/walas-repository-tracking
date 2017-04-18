import { StateManager } from './statemanager';
import { getMetaEntities } from 'walas-meta-api';

export class DbContext {
  constructor() {
    this._stateManager = new StateManager();
    this._conventions = [];
    // this._metaEntities = getMetaEntities(DbContext)
  }
  setState(entity, state) {
    this._stateManager.addEntry({
      entity: entity,
      state: state
    });
  }
  saveChanges() {
    // TODO: implement UOW
    this._stateManager.reset();
  }
  config() {
    this.metaEntities.forEach(entity => {
      this._conventions.map(Convention =>
        new Convention(entity.entity, entity.meta).exec());
    });
  }
}



