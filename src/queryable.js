import {validateEntity} from './utils/helperqueryable';
export class Queryable{
    constructor(entity){
        validateEntity(entity);
        this._entity = entity;
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