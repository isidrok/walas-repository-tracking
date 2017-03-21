import { STATES } from './states';
export class Query {
    constructor(entity, setState) {
        this._entity = entity;
        this._setState = setState;
    }
    add(entity) {
        this.setState(STATES.ADD, entity);
    }
    update(entity) {
        this.setState(STATES.UPDATE, entity);
    }
    delete(entity) {
        this.setState(STATES.DELETE, entity);
    }
    setUnchanged(entity) {
        this.setState(STATES.UNCHANGED, entity);
    }
    findById(id) {

    }

}