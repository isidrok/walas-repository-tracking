import { STATES } from './states';
import { validadeQueryParams, validateInstance } from './helperquery';
export class Query {
    constructor(entity, setState) {
        validadeQueryParams(entity, setState)
        this._entity = entity;
        this._setState = setState;
    }
    add(instance) {
        validateInstance(instance);
        this.setState(STATES.ADD, instance);
    }
    update(instance) {
        validateInstance(instance);
        this.setState(STATES.UPDATE, instance);
    }
    delete(instance) {
        validateInstance(instance);
        this.setState(STATES.DELETE, instance);
    }
    setUnchanged(instance) {
        validateInstance(instance);
        this.setState(STATES.UNCHANGED, instance);
    }
    findById(id) {
        //TODO: specify everything this method needs to do
    }

}
