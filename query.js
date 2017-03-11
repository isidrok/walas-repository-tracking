import { states } from './utils/symbol';
export class Query {
    constructor(entity, setState) {
        this._entity = entity;
        this._setState = setState;
    }
    add(entity) {
        this.setState(states.add, entity);
    }
    update(entity) {
        this.setState(states.update, entity);
    }
    delete(entity) {
        this.setState(states.delete, entity);
    }
    setUnchanged(entity) {
        this.setState(states.unchanged, entity);
    }
    findById(id) {

    }

}