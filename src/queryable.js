import {validateEntity, validateContext} from './utils/helperqueryable';
export class Queryable{
    constructor(entity,context){
        validateEntity(entity);
        validateContext(context);
        this._entity = entity;
        this._context = context;        
        this._expression ={};
        this._provider = null; //TODO:resolve provider

    }
    select(projection){        
        this._expression.select = projection.toString();
        return this;
    }
    where(predicate){
        this._expression.where = predicate;
        return this;
    }
    order(){
        return this;
    }
    get provider(){
        //TODO
        return this._provider;
    }
    get expression(){
       return this._expression;
    }
}