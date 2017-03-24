import {validateEntity, validateContext} from './utils/helperqueryable';
export class Queryable{
    constructor(entity,context){
        validateEntity(entity);
        validateContext(context);
        this._entity = entity;
        this._context = context;

    }
    select(){
        return this;
    }
    where(){
        return this;
    }
    order(){
        return this;
    }
    provider(){
        //TODO
    }
}