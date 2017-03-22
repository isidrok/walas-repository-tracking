export function validadeQueryParams(entity, setState) {
    if (!entity || !setState || typeof setState !== 'function')
        throw new Error(`Invalid Query arguments`);
}

export function validateInstance(instance, entity) {
    if (!instance || instance.constructor.name !== entity.name)
        throw new Error(`Invalid instance`);
}
