export function validadeQueryParams(entity, setState) {
    if (!entity || !setState || typeof setState !== 'function')
        throw new Error(`Invalid Query arguments`);
}

export function validateInstance(instance){
    //TODO: see if we can math an instance with the entity (class) to check if it is a valid object
    if(!instance || typeof instance != 'object')
    throw new Error(`Instance does not exist or is not an object`);
}
