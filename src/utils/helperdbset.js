export function validateInstance(instance, entity) {
    if (!instance || instance.constructor.name !== entity.name)
        throw new Error(`Invalid Instance`);
    //TODO: i18n
}

