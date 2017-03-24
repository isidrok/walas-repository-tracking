function checkInstanceExist(instance) {
    if (!instance)
        throw new Error('Instance does not exists');
}

function checkInstanceBelongsToEntity(instance, entity) {
    if (instance.constructor.name !== entity.name)
        throw new Error('Instance does not belong to Entity');
}

export function validateInstance(instance, entity) {
    //TODO: i18n
    checkInstanceExist(instance);
    checkInstanceBelongsToEntity(instance, entity);

    
}

