import { STATES } from './states';
import { validadeQueryParams, validateInstance } from './helperquery';
export class Query {
    constructor(entity, setState) {
        validadeQueryParams(entity, setState)
        this.entity = entity;
        this.setState = setState;
    }
    add(instance) {
        validateInstance(instance, this.entity);
        this.setState(STATES.ADD, instance);
    }
    update(instance) {
        validateInstance(instance, this.entity);
        this.setState(STATES.UPDATE, instance);
    }
    delete(instance) {
        validateInstance(instance, this.entity);
        this.setState(STATES.DELETE, instance);
    }
    setUnchanged(instance) {
        validateInstance(instance, this.entity);
        this.setState(STATES.UNCHANGED, instance);
    }
    findById(id) {
        //TODO: specify everything this method needs to do
    }

}
