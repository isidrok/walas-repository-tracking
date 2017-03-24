import { STATES } from './states';
import {validateInstance, validateContext } from './utils/helperdbset';
import {Queryable} from './queryable';
export class DbSet extends Queryable{
    constructor(entity, context) {
        validateContext(context);
        super(entity);
        this._context = context;
    }
    add(instance) {
        validateInstance(instance, this._entity);
        this._context.setState(instance, STATES.ADD);
    }
    update(instance) {
        validateInstance(instance, this._entity);
        this._context.setState(instance, STATES.UPDATE);
    }
    delete(instance) {
        validateInstance(instance, this._entity);
        this._context.setState(instance, STATES.DELETE);
    }
    findById(id) {
        //TODO: specify everything this method needs to do
    }

}
