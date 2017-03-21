import { STATES } from './states';
export class Query {
    constructor(entity, setState) {
        this._entity = entity;
        this._setState = setState;
    }
    add(instance) {
        this.setState(STATES.ADD, instance);
    }
    update(instance) {
        this.setState(STATES.UPDATE, instance);
    }
    delete(instance) {
        this.setState(STATES.DELETE, instance);
    }
    setUnchanged(instance) {
        this.setState(STATES.UNCHANGED, instance);
    }
    findById(id) {

    }

}